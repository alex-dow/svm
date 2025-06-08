'use client';
import { useState } from "react";
import MultiItemModal from "../MultiItemModal";
import { Button } from "primereact/button";
import { StationMode } from "@/lib/types";
import { handleAddStopItems } from "@/lib/actions/trains";
import { IItemSchema } from "@/lib/types/satisfactory/schema/IItemSchema";
import { ItemType } from "@/lib/satisfactory/data";

export default function AddStopItemButton({stopId, mode}: {stopId: number, mode: StationMode}) {

    const [showModal, setShowModal] = useState(false);

    const onSave = async (items: IItemSchema[]) => {
        await handleAddStopItems(stopId, items.map(item => ({itemId: item.className as ItemType, mode})));
    }

    return (
        <>
            <Button 
                icon="pi pi-plus" 
                onClick={() => setShowModal(true)}
                size="small"
                outlined
                rounded
                style={{
                    height: '2rem', width: '1rem', padding: '1rem'
                }}
            />
            <MultiItemModal onHide={() => setShowModal(false)} visible={showModal} onSave={onSave}/>
        </>
    )
}