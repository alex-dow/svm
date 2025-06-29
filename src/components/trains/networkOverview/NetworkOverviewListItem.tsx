import ItemIcon from "@/components/ItemIcon";
import { ItemLabel } from "@/components/ItemLabel";
import { NetworkOverviewItem } from "@/lib/types";
import React from "react";

export interface NetworkOverviewListItemProps {
  item: NetworkOverviewItem;
  onItemClick?: (item: NetworkOverviewItem) => void;
}

export default function NetworkOverviewListItem({
  item,
  onItemClick
}: NetworkOverviewListItemProps) {
  const onClick = (e: React.MouseEvent) => {
    if (onItemClick) {
        e.preventDefault();
        onItemClick(item);
    }
  };

  return (
    <button
      className="flex flex-wrap flex-1 gap-4 cursor-pointer hover:bg-amber-900 p-1 @container"
      onClick={onClick}
    >
      <div>
        <ItemIcon itemClassname={item.item_classname} width={24} height={24} />
      </div>
      <div>
        <ItemLabel itemClassname={item.item_classname} />
      </div>
      <div className="flex-1 text-right">{item.rate} / min</div>
    </button>
  );
}
