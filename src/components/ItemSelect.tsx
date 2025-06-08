'use client';
import { IItemSchema } from "@/lib/types/satisfactory/schema/IItemSchema";
import { Dropdown } from "primereact/dropdown";
import { items } from "@/lib/satisfactory/data";

export interface ItemSelectProps {
    className?: string,
    id?: string,
    value?: string,
    onChange?: (item: string) => void,
    itemFilter?: (item: IItemSchema) => boolean
};

export function ItemSelect(props: ItemSelectProps) {

    let availableItems: IItemSchema[] = [];

    if (props.itemFilter) {
        availableItems = Object.values(items).filter(props.itemFilter);
    } else {
        availableItems = Object.values(items);
    }

    return (
        <Dropdown 
            value={props.value} 
            onChange={(e) => {
                if (props.onChange) {
                    props.onChange(e.value)
                }
            }}
            options={availableItems}
            optionLabel="name"
            optionValue="className"
            filter
        />
    )
}