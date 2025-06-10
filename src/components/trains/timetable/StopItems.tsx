import { handleGetStopItems } from "@/lib/actions/trains";
import { TrainTimetableStopItem } from "@/server/db/schemas/trains";
import { DeleteStopItemButton } from "../platforms/buttons/DeleteStopItemButton";
import AddStopItemButton from "../AddStopItemButton";
import { items } from "@/lib/satisfactory/data";
import { StopWithStation } from "@/lib/types";

export interface StopItemsProps {
    stop: StopWithStation
}

export function StopItem({itemId, itemLabel}: {itemId: number, itemLabel: string}) {
    return (
        <li key={itemId} className="flex justify-between">
            <div>{itemLabel}</div>
            <DeleteStopItemButton stopItemId={itemId}/>
        </li>
    )
}

export default async function StopItems({stop}: StopItemsProps) {
    const stopItems = await handleGetStopItems(stop.id);

    const [ loadingItems, unloadingItems ] = stopItems.reduce<[TrainTimetableStopItem[], TrainTimetableStopItem[]]>((a, item) => {
        if (item.mode === "loading") {
            a[0].push(item);
        } else {
            a[1].push(item);
        }
        return a;
    },[[],[]])



    return (
        <div className="flex gap-2">
            <div className="w-1/2">
                <div className="flex gap-2 items-center">
                    <AddStopItemButton stop={stop} mode="loading"/>
                    <h1>Loading</h1>
                    
                </div>
                <ul>
                    {loadingItems.map((item) => (
                        <StopItem 
                            key={item.id} 
                            itemId={item.id} 
                            itemLabel={items[item.item_classname].name || item.item_classname}
                        />
                    ))}
                </ul>
            </div>
            <div className="w-1/2">
            <div className="flex gap-2 items-center">
                    <AddStopItemButton stop={stop} mode="unloading"/>
                    <h1>Unloading</h1>
                    
                </div>
                <ul>
                    {unloadingItems.map((item) => (
                        <StopItem 
                            key={item.id} 
                            itemId={item.id} 
                            itemLabel={items[item.item_classname].name || item.item_classname}
                        />
                    ))}
                </ul>
            </div>
        </div>

    )
}