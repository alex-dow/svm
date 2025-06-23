import { items, ItemType } from "@/lib/satisfactory/data";
import Image from "next/image";


export interface ItemIconProps {
    itemClassname: ItemType,
    width: number,
    height: number,
    alt?: string,
    title?: string
}

export default function ItemIcon({itemClassname, width, height, alt, title}: ItemIconProps) {
    const iconSize = (width > 64) ? 256 : 64;
    const itemIcon = items[itemClassname].icon;
    const iconPath = `/data/items/${itemIcon}_${iconSize}.png`;
    const itemName = items[itemClassname].name;
    const iconAlt = alt ?? itemName;
    const iconTitle = title ?? itemName;

    return (
        <Image
          src={iconPath}
          width={width}
          height={height}
          alt={iconAlt}
          title={iconTitle}
          
        />
    )
}