'use client';

import ItemModal, { ItemModalOnSaveArgs } from "@/components/ItemModal";
import { handleAddPlatformItem } from "@/lib/actions/trainStations";
import { ItemType } from "@/lib/satisfactory/data";
//import { addStationPlatformItem } from "@/lib/services/stationPlatforms";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";


export function AddItemButton({platformId}: {platformId: number}) {
    const [ showItemModal, setShowItemModal ] = useState(false);
    const toast = useRef<Toast>(null);

    const onSave = async (e: ItemModalOnSaveArgs) => {
        try {
            await handleAddPlatformItem(platformId, e.item.className as ItemType, e.rate);
        } catch (err) {
            if (err instanceof Error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: err.message });
            } else {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'An unknown error occurred' });
            }
        }
    }

    const onClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowItemModal(true);
    }

    return (
        <div>
            <Toast ref={toast} />
            <Button 
                icon="pi pi-plus"
                outlined
                title="Add item"
                onClick={onClick}
                className="p-1 pt-1.5 w-8"
            />
            <ItemModal
                visible={showItemModal} 
                onHide={() => setShowItemModal(false)} 
                onSave={onSave}
            />
        </div>
    )
}