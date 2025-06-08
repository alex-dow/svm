import { NetworkOverviewItem } from "@/lib/types";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useEffect, useState } from "react";
import NetworkOverviewListItem from "./NetworkOverviewListItem";
import Image from "next/image";
import { items as itemData } from "@/lib/satisfactory/data";

export function NetworkOverviewGroupedListHeader({items}: {items: NetworkOverviewItem[]}) {
    return (
        <div className="flex items-center gap-5">
            <div>Platform {items[0].position}</div>
            <div className="flex flex-1 gap-2">
                {items.map((item) => (
                    <Image 
                        key={item.item_id}
                        src={"/data/items/" + itemData[item.item_id].icon + "_64.png"} 
                        alt={itemData[item.item_id].name} 
                        width={20} 
                        height={20} 
                    />
                ))}
            </div>
        </div>
    )
}

export default function NetworkOverviewGroupedList({items}: {items: NetworkOverviewItem[][]}) { 

    return (
        <Accordion>
            {items.map((platformItems) => (
                <AccordionTab key={platformItems[0].position} header={<NetworkOverviewGroupedListHeader items={platformItems} />}>
                    {platformItems.map((item) => (<NetworkOverviewListItem item={item} key={item.item_id} />))}
                </AccordionTab>
            ))}
        </Accordion>
    )

}