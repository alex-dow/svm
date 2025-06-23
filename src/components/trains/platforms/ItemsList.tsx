import { ItemLabel } from "@/components/ItemLabel";
import { TrainStationPlatformItem } from "@/server/db/schemas/trainStations"; 
import { DeleteItemButton } from "./buttons/DeleteItemButton";
import ItemIcon from "@/components/ItemIcon";
import { Inplace, InplaceContent, InplaceDisplay } from "primereact/inplace";
import ItemListRate from "./ItemListRate";

export default async function ItemsList({platformId, items}: {platformId: number, items: TrainStationPlatformItem[]}) {

    return (
        <ul>
            {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-2 items-center">
                    <div className="flex gap-2 items-center">
                        <ItemIcon
                            itemClassname={item.item_classname}
                            width={24}
                            height={24}
                        />
                        <ItemLabel itemClassname={item.item_classname}/>
                    </div>
                    <div className="flex-1 text-right">
                        <ItemListRate item={item} platformId={platformId}/>
                    </div>
                    <DeleteItemButton platformId={platformId} itemId={item.id}/>
                </li>
            ))}
        </ul>
    )
}