import { NetworkOverviewItem } from "@/lib/types";
import NetworkOverviewListItem from "./NetworkOverviewListItem";

export default function NetworkOverviewUngroupedList({ items, onItemClick }: { items: NetworkOverviewItem[], onItemClick?: (item: NetworkOverviewItem)=>void }) {
    return (
        <div className="flex flex-col p-1">
            {items.map((item) => (<NetworkOverviewListItem onItemClick={onItemClick} item={item} key={item.item_classname} />))}
        </div>
    )
}