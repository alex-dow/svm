'use client';
import { Dialog } from "primereact/dialog"
import { InputNumber } from "primereact/inputnumber"
import { IItemSchema } from "@/lib/types/satisfactory/schema/IItemSchema";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { getSatisfactoryItems } from "@/lib/satisfactory/data";
import { ItemMultiSelect } from "./ItemMultiSelect";

export interface ItemModalOnSaveArgs {
    item: IItemSchema, 
    rate: number
}

export interface MultiItemModalProps {
    items?: IItemSchema[],
    visible: boolean,
    showRate?: boolean,
    onHide: () => void,
    onSave: (v: IItemSchema[]) => void
}

export default function MultiItemModal(props: MultiItemModalProps) {

    const [ selectedItemClassNames, setSelectedItemClassNames ] = useState<string[]>([]);
    const [ rate, setRate ] = useState<number | null>(0);

    useEffect(() => {
        if (props.items) {
            setSelectedItemClassNames(props.items.map(item => item.className));
        }
    },[props.items]);

    const onSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const items = await getSatisfactoryItems();
        if (props.onSave && selectedItemClassNames) {
            props.onSave(selectedItemClassNames.map(className => items[className]));
        }
        props.onHide();
    }

    return (
    <Dialog visible={props.visible} onHide={props.onHide} >
        <form className="flex flex-col gap-2" onSubmit={onSave}>
            <ItemMultiSelect 
                value={selectedItemClassNames} 
                onChange={(e) => setSelectedItemClassNames(e)}
            />
            <Button severity="help" label="Save" type="submit"/>
        </form>
    </Dialog>
    );
}