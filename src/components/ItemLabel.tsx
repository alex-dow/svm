'use client';
import { items } from "@/lib/satisfactory/data";

export function ItemLabel({itemClassname}: {itemClassname: keyof typeof items}) {
    return (<>{items[itemClassname]?.name || itemClassname}</>)
}