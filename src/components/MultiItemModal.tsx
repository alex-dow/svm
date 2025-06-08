'use client';
import { Dialog } from "primereact/dialog"
import { IItemSchema } from "@/lib/types/satisfactory/schema/IItemSchema";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { items, ItemType } from "@/lib/satisfactory/data";
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

    const [ selectedItemClassNames, setSelectedItemClassNames ] = useState<ItemType[]>([]);

    useEffect(() => {
        if (props.items) {
            console.log('items', props.items);
            setSelectedItemClassNames(props.items.map(item => item.className as ItemType));
        } else {
            setSelectedItemClassNames([]);
        }
    },[props.items]);

    const onSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (props.onSave && selectedItemClassNames) {
            props.onSave(selectedItemClassNames.map((className: ItemType) => items[className]));
        }
        props.onHide();
    }

    return (
    <Dialog visible={props.visible} onHide={props.onHide} >
        <form className="flex flex-col gap-2" onSubmit={onSave}>
            <ItemMultiSelect 
                value={selectedItemClassNames || []} 
                onChange={(e) => setSelectedItemClassNames(e)}
            />
            <Button severity="help" label="Save" type="submit"/>
        </form>
    </Dialog>
    );
}