'use client';
import { getSatisfactoryItems, getSatisfactoryItemsArray } from "@/lib/satisfactory/data";
import { IItemSchema } from "@/lib/types/satisfactory/schema/IItemSchema";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";

export interface ItemSelectProps {
    className?: string,
    id?: string,
    value?: string,
    onChange?: (item: string) => void,
    itemFilter?: (item: IItemSchema) => boolean
};

export function ItemSelect(props: ItemSelectProps) {

    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<IItemSchema[]>([]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let itemMap: Record<string, IItemSchema> = {};

    const refresh = async () => {
        setLoading(true);
        try {
            let items = await getSatisfactoryItemsArray();
            if (props.itemFilter) {
                items = items.filter(props.itemFilter);
            }
            itemMap = await getSatisfactoryItems()
            if (items) {
                setItems(items);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }

    useEffect(() => {
        refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
        <Dropdown 
            value={props.value} 
            onChange={(e) => {
                if (props.onChange) {
                    props.onChange(e.value)
                }
            }}
            options={items}
            optionLabel="name"
            optionValue="className"
            loading={loading}
            filter
        />
    )
}