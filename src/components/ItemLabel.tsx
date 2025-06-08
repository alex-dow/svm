'use client';
import { items } from "@/lib/satisfactory/data";

export function ItemLabel({itemId}: {itemId: keyof typeof items}) {
    return (<>{items[itemId]?.name || itemId}</>)
}