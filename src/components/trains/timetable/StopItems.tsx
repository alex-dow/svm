import { handleGetStopItems } from "@/lib/actions/trains";
import { TrainTimetableStopItem } from "@/server/db/schemas/trains";
import { DeleteStopItemButton } from "../platforms/buttons/DeleteStopItemButton";

export interface StopItemsProps {
    projectId: number;
    trainId: number;
    stopId: number;
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
            <div>
                <h1>Loading</h1>
                <ul>
                    {loadingItems.map((item) => (
                        <li key={item.id} className="flex justify-between">
                            <div>{item.item_id}</div>
                            <DeleteStopItemButton stopItemId={item.id}/>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h1>Unloading</h1>
                <ul>
                    {unloadingItems.map((item) => (
                        <li key={item.id}>{item.item_id}</li>
                    ))}
                </ul>
            </div>
        </div>

    )
}