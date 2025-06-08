import { ItemLabel } from "@/components/ItemLabel";
import { NetworkOverviewItem } from "@/lib/types";

export default function NetworkOverviewListItem({ item }: { item: NetworkOverviewItem }) {
    return (
        <div className="flex justify-between">
            <div>
                <ItemLabel itemId={item.item_id} />
            </div>
            <div>
                {item.rate} / min
            </div>
        </div>
    )
}