'use client';
import { useEffect, useState } from "react";
import NetworkOverviewListItem from "./NetworkOverviewListItem";
import { TrainNetworkItem } from "@/server/db/schemas/trains";
import { sortItemsByName, sortItemsByRate } from "@/lib/sorters/networkItems";
import { ItemType } from "@/lib/satisfactory/data";


export interface NetworkOverviewUngroupedListProps {
    items: TrainNetworkItem[],
    onItemClick?: (item: TrainNetworkItem)=>void
    mode: 'loading' | 'unloading' | 'availability'
    sortBy?: 'name' | 'rate'
    sortOrder?: 'asc' | 'desc'
}

export default function NetworkOverviewUngroupedList({ items, onItemClick, mode, sortBy, sortOrder }: NetworkOverviewUngroupedListProps) {

    const [sortedItems, setSortedItems] = useState<TrainNetworkItem[]>([]);

    useEffect(() => {

        const totalItems = Object.values(items.reduce((a, item) => {
            if (!a[item.item_classname]) {
                a[item.item_classname] = {...item};
            } else {
                a[item.item_classname].loading_rate += item.loading_rate;
                a[item.item_classname].unloading_rate += item.unloading_rate;
                a[item.item_classname].availability += item.availability;
            }

            return a;
        }, {} as Record<ItemType, TrainNetworkItem>));

        if (sortBy === 'name') {
            totalItems.sort(sortItemsByName);
        } else {
            totalItems.sort((a,b) => sortItemsByRate(a,b,mode));
        }
        setSortedItems(totalItems);
    }, [items, sortBy, sortOrder, mode]);

    return (
        <div className="flex flex-col p-1">
            {sortedItems.map((item) => (
                <NetworkOverviewListItem onItemClick={onItemClick} item={item} key={item.id} mode={mode} />
            ))}
        </div>
    )
}