import { ItemLabel } from "@/components/ItemLabel";
import { TrainStationPlatformItem } from "@/server/db/schemas/trainStations"; 
import { DeleteItemButton } from "./buttons/DeleteItemButton";

export default async function ItemsList({platformId, items}: {platformId: number, items: TrainStationPlatformItem[]}) {

    return (
        <ul>
            {items.map((item) => (
                <li key={item.id} className="flex justify-between">
                    <ItemLabel itemId={item.item_id}/> - rate: {item.rate} / min
                    <DeleteItemButton platformId={platformId} itemId={item.id}/>
                </li>
            ))}
        </ul>
    )
}