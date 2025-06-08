import { NetworkOverviewItem } from "@/lib/types";
import NetworkOverviewListItem from "./NetworkOverviewListItem";

export default function NetworkOverviewUngroupedList({ items }: { items: NetworkOverviewItem[] }) {
    return (
        <div className="flex flex-col gap-2">
            {items.map((item) => (<NetworkOverviewListItem item={item} key={item.item_id} />))}
        </div>
    )
}