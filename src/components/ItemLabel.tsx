'use client';
import { getSatisfactoryItems } from "@/lib/satisfactory/data";
import { IItemSchema } from "@/lib/types/satisfactory/schema/IItemSchema";
import { useEffect, useState } from "react";

export function ItemLabel({itemId}: {itemId: string}) {
    const [ itemsMap, setItemsMap ] = useState<Record<string, IItemSchema>>({});
    useEffect(() => {
        getSatisfactoryItems().then(setItemsMap);
    },[]);
    return (<>{itemsMap[itemId]?.name}</>)
}