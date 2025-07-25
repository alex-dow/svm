'use client';
import ItemIcon from "@/components/ItemIcon";
import { ItemLabel } from "@/components/ItemLabel";
import { TrainNetworkItem } from "@/server/db/schemas/trains";
import React from "react";

export interface NetworkOverviewListItemProps {
  item: TrainNetworkItem;
  mode: 'loading' | 'unloading' | 'availability';
  onItemClick?: (item: TrainNetworkItem) => void;
}

export default function NetworkOverviewListItem({
  item,
  mode,
  onItemClick
}: NetworkOverviewListItemProps) {
  const onClick = (e: React.MouseEvent) => {
    if (onItemClick) {
        e.preventDefault();
        onItemClick(item);
    }
  };

  const rate = (mode === 'loading') ? item.loading_rate : (mode === 'unloading') ? item.unloading_rate : item.availability;

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
      <div className="flex-1 text-right">{rate} / min</div>
    </button>
  );
}
