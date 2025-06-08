'use client';
import { useState } from "react";
import { Button } from "primereact/button";
import { StationMode, StopWithStation } from "@/lib/types";
import TimetableStopItemModal from "./modals/TimetableStopItemModal";

export default function AddStopItemButton({stop, mode}: {stop: StopWithStation, mode: StationMode}) {

    const [showModal, setShowModal] = useState(false);

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
            <TimetableStopItemModal visible={showModal} onHide={() => setShowModal(false)} stop={stop} mode={mode}/>
            
        </>
    )
}