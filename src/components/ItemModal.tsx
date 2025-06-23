'use client';
import { Dialog } from "primereact/dialog"
import { ItemSelect } from "./ItemSelect"
import { InputNumber } from "primereact/inputnumber"
import { IItemSchema } from "@/lib/types/satisfactory/schema/IItemSchema";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { items, ItemType } from "@/lib/satisfactory/data";

export interface ItemModalOnSaveArgs {
    item: IItemSchema, 
    rate: number
}

export interface ItemModalProps {
    item?: IItemSchema
    rate?: number,
    visible: boolean,
    onHide: () => void,
    onSave: (v: ItemModalOnSaveArgs) => void
}

export default function ItemModal(props: ItemModalProps) {

    const [ selectedItemClassName, setSelectedItemClassName ] = useState<string | undefined>();
    const [ rate, setRate ] = useState<number | null>(0);

    useEffect(() => {
        if (props.item) {
            setSelectedItemClassName(props.item.className);
        }
        if (props.rate) {
            setRate(props.rate);
        }
    },[props.item, props.rate]);

    const onSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (props.onSave && selectedItemClassName) {
            props.onSave({
                item: items[selectedItemClassName as ItemType],
                rate: rate || 0
            });
        }
        props.onHide();
    }

    return (
    <Dialog visible={props.visible} onHide={props.onHide} header="Add item" onClick={(e) => e.stopPropagation()}>
        <form className="flex flex-col gap-2" onSubmit={onSave}>
            <ItemSelect value={selectedItemClassName} onChange={(e) => setSelectedItemClassName(e)}/>
            <InputNumber value={rate} onChange={(e) => setRate(e.value)} placeholder="Rate" suffix=" / min" onKeyDown={(e) => e.stopPropagation()}/>
            <Button severity="help" label="Save" type="submit"/>
        </form>
    </Dialog>
    );
}