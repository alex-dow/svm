'use client';
import { handleGetStationItems } from "@/lib/actions/trainStations";
import { NetworkOverviewItem, StationMode, StopWithStation } from "@/lib/types";
import { IItemSchema } from "@/lib/types/satisfactory/schema/IItemSchema";
import { useEffect, useState } from "react";
import { ItemType } from "@/lib/satisfactory/data";
import { ItemMultiSelect } from "@/components/ItemMultiSelect";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Checkbox } from "primereact/checkbox";
import { handleAddStopItems } from "@/lib/actions/trains";

export interface TimetableStopItemModalProps {
    visible: boolean,
    onHide: () => void,
    stop: StopWithStation,
    mode: StationMode
}

export default function TimetableStopItemModal({visible, onHide, stop, mode}: TimetableStopItemModalProps) {
    
    const [ loadingStationItems, setLoadingStationItems ] = useState(false);
    const [ stationItems, setStationItems] = useState<NetworkOverviewItem[]>([]);
    const [ filterItems, setFilterItems] = useState(false);
    const [ selectedItems, setSelectedItems] = useState<ItemType[]>([]);

    useEffect(() => {
        setLoadingStationItems(true);
        handleGetStationItems(stop.station_id)
        .then((res) => {
            setLoadingStationItems(false);
            setStationItems(res);
        })
        .catch((err) => {
            console.error(err);
            setStationItems([]);
        })
        .finally(() => {
            setLoadingStationItems(false);
        })
    }, [stop]);



    const itemFilter = (item: IItemSchema) => {
        return stationItems.findIndex((stationItem) => stationItem.item_id === item.className) > -1;
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            await handleAddStopItems(stop.id, selectedItems.map((item) => ({itemId: item, mode})));
            onHide();
        } catch (err) {
            console.error(err);
        }
    }

    const header = mode === 'loading' ? 'Add items to load' : 'Add items to unload';

    return (
        <Dialog visible={visible} header={header} onHide={onHide}>
            <form onSubmit={onSubmit}>
                <div className="flex flex-col gap-4">
                    <Checkbox id="filter-items" checked={filterItems} onChange={(e) => setFilterItems(e.checked ?? false)} />
                    <label htmlFor="filter-items">Show only items available at {stop.station_name}</label>
                </div>
                {!filterItems && <ItemMultiSelect loading={loadingStationItems} onChange={(e) => setSelectedItems(e)} value={selectedItems} /> }
                {filterItems && <ItemMultiSelect loading={loadingStationItems} onChange={(e) => setSelectedItems(e)} value={selectedItems} itemFilter={itemFilter} /> }
                { selectedItems.length > 0 && (
                    <Button label="Add items" type="submit" />
                )}
            </form>
        </Dialog>
    )
}