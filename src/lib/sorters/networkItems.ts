import { TrainNetworkItem } from "@/server/db/schemas/trains";
import { items } from "../satisfactory/data";

export function sortItemsByName(itemA: TrainNetworkItem, itemB: TrainNetworkItem) {
    const itemAName = (items[itemA.item_classname]) ? items[itemA.item_classname].name : itemA.item_classname;
    const itemBName = (items[itemB.item_classname]) ? items[itemB.item_classname].name : itemB.item_classname;

    return itemAName.localeCompare(itemBName);
}

export function sortItemsByRate(itemA: TrainNetworkItem, itemB: TrainNetworkItem, mode: 'loading' | 'unloading' | 'availability') {
    const itemARate = (mode === 'loading') ? itemA.loading_rate : (mode === 'unloading') ? itemA.unloading_rate : itemA.availability;
    const itemBRate = (mode === 'loading') ? itemB.loading_rate : (mode === 'unloading') ? itemB.unloading_rate : itemB.availability;

    return itemARate - itemBRate;
}