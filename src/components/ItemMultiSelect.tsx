'use client';
import { IItemSchema } from "@/lib/types/satisfactory/schema/IItemSchema";
import { MultiSelect } from "primereact/multiselect";
import { items, ItemType } from "@/lib/satisfactory/data";

export interface ItemSelectProps {
    className?: string,
    id?: string,
    value: ItemType[],
    loading?: boolean,
    onChange?: (items: ItemType[]) => void,
    itemFilter?: (item: IItemSchema) => boolean
};

export function ItemMultiSelect(props: ItemSelectProps) {

    let availableItems: IItemSchema[] = [];

    if (props.itemFilter) {
        availableItems = Object.values(items).filter(props.itemFilter);
    } else {
        availableItems = Object.values(items);
    }

    return (
        <MultiSelect 
            value={props.value} 
            onChange={(e) => {
                if (props.onChange) {
                    props.onChange(e.value)
                }
            }}
            loading={props.loading}
            options={availableItems}
            optionLabel="name"
            optionValue="className"
            display="chip"
            maxSelectedLabels={4}
            virtualScrollerOptions={{ itemSize: 43 }}
            filter
        />
    )
}