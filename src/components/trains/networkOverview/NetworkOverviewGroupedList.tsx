import { NetworkOverviewItem } from "@/lib/types";
import { Accordion, AccordionTab } from "primereact/accordion";
import NetworkOverviewListItem from "./NetworkOverviewListItem";
import Image from "next/image";
import { items as itemData } from "@/lib/satisfactory/data";

export function NetworkOverviewGroupedListHeader({items}: {items: NetworkOverviewItem[]}) {
    return (
        <div className="flex gap-2 items-center">
            <div>Platform {items[0].position}</div>
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

export default function NetworkOverviewGroupedList({items, onItemClick}: {items: NetworkOverviewItem[][], onItemClick?: (item: NetworkOverviewItem) => void}) { 

    return (
        <Accordion pt={{
            accordiontab: {
                className: 'p-0'
            }
        }}>
            {items.map((platformItems) => (
                <AccordionTab 
                    key={platformItems[0].position} 
                    header={
                        <NetworkOverviewGroupedListHeader 
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
                    {platformItems.map((item) => (<NetworkOverviewListItem item={item} key={item.item_classname} onItemClick={onItemClick} />))}
                </AccordionTab>
            ))}
        </Accordion>
    )

}