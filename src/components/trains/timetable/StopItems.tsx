import { handleGetStopItems } from "@/lib/actions/trains";
import { TrainTimetableStopItem } from "@/server/db/schemas/trains";
import { DeleteStopItemButton } from "../platforms/buttons/DeleteStopItemButton";
import AddStopItemButton from "../AddStopItemButton";

export interface StopItemsProps {
    projectId: number;
    trainId: number;
    stopId: number;
}

export function StopItem({item}: {item: TrainTimetableStopItem}) {
    return (
        <li key={item.id} className="flex justify-between">
            <div>{item.item_id}</div>
            <DeleteStopItemButton stopItemId={item.id}/>
        </li>
    )
}

export default async function StopItems({stopId}: StopItemsProps) {
    const stopItems = await handleGetStopItems(stopId);

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
                    <AddStopItemButton stopId={stopId} mode="loading"/>
                    <h1>Loading</h1>
                    
                </div>
                <ul>
                    {loadingItems.map((item) => (<StopItem key={item.id} item={item}/>))}
                </ul>
            </div>
            <div className="w-1/2">
            <div className="flex gap-2 items-center">
                    <AddStopItemButton stopId={stopId} mode="unloading"/>
                    <h1>Unloading</h1>
                    
                </div>
                <ul>
                    {unloadingItems.map((item) => (<StopItem key={item.id} item={item}/>))}
                </ul>
            </div>
        </div>

    )
}