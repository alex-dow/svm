'use client';
import { Accordion, AccordionTab } from "primereact/accordion";
import NetworkOverviewListItem from "./NetworkOverviewListItem";
import Image from "next/image";
import { items as itemData } from "@/lib/satisfactory/data";
import { TrainNetworkItem } from "@/server/db/schemas/trains";
import { useEffect, useState } from "react";
import { sortItemsByName, sortItemsByRate } from "@/lib/sorters/networkItems";

export function NetworkOverviewGroupedListHeader({items, position}: {items: TrainNetworkItem[], position: number}) {
    return (
        <div className="flex gap-2 items-center">
            <div>Platform {position}</div>
            <div className="flex flex-1 gap-2 flex-wrap">
                {items.map((item) => (
                    <Image 
                        key={item.item_classname}
                        src={"/data/items/" + itemData[item.item_classname].icon + "_64.png"} 
                        alt={itemData[item.item_classname].name} 
                        width={20} 
                        height={20} 
                        title={itemData[item.item_classname].name}
                    />
                ))}
            </div>
        </div>
    )
}

export interface NetworkOverviewGroupedListProps {
    items: TrainNetworkItem[],
    onItemClick?: (item: TrainNetworkItem) => void
    mode: 'loading' | 'unloading' | 'availability',
    sortBy?: 'name' | 'rate'
    sortOrder?: 'asc' | 'desc'
}



export default function NetworkOverviewGroupedList({items, onItemClick, mode, sortBy, sortOrder}: NetworkOverviewGroupedListProps) { 

    const [groupedItems, setGroupedItems] = useState<TrainNetworkItem[][]>([]);

    useEffect(() => {
        const groupedItems = items.reduce((a, item) => {
            if (a[item.platform_position-1] === undefined) {
                a[item.platform_position-1] = [];
            }
            a[item.platform_position-1].push(item);
            return a;
        }, [] as TrainNetworkItem[][]).map((platformItems) => {

            if (sortBy === 'name') {
                platformItems.sort(sortItemsByName);
            } else {
                platformItems.sort((a,b) => sortItemsByRate(a,b,mode));
            }
            return platformItems;
        })
        setGroupedItems(groupedItems);
    }, [items, sortBy, sortOrder, mode]);


    return (
        <Accordion pt={{
            accordiontab: {
                className: 'p-0'
            }
        }}>
            {groupedItems.map((platformItems, idx) => (
                <AccordionTab 
                    key={platformItems[0].project_id + '-' + idx} 
                    header={
                        <NetworkOverviewGroupedListHeader 
                            position={idx+1}
                            items={platformItems} 
                    />}
                    pt={{
                        headerAction: {
                            className: 'p-2'
                        },
                        content: {
                            className: 'p-1 flex-1 flex flex-col'
                        }
                    }}
                >
                    {platformItems.map((item) => (<NetworkOverviewListItem item={item} key={item.item_classname} onItemClick={onItemClick} mode={mode} />))}
                </AccordionTab>
            ))}
        </Accordion>
    )

}