import { ItemLabel } from "@/components/ItemLabel";
import { items } from "@/lib/satisfactory/data";
import { NetworkOverviewItem } from "@/lib/types";
import Image from "next/image";
import React from "react";

export interface NetworkOverviewListItemProps {
  item: NetworkOverviewItem;
  onItemClick?: (item: NetworkOverviewItem) => void;
}

export default function NetworkOverviewListItem({
  item,
  onItemClick
}: NetworkOverviewListItemProps) {
  const itemIcon = items[item.item_classname].icon;
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
        <Image
          src={"/data/items/" + itemIcon + "_64.png"}
          width={24}
          height={24}
          alt={items[item.item_classname].name}
          title={items[item.item_classname].name}
        />
      </div>
      <div>
        <ItemLabel itemClassname={item.item_classname} />
      </div>
      <div className="flex-1 text-right">{item.rate} / min</div>
    </button>
  );
}
