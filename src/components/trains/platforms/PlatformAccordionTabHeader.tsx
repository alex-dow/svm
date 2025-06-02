'use client';
import ItemModal from "@/components/ItemModal";
import { addStationPlatformItem } from "@/lib/services/stationPlatforms";
import { Button } from "primereact/button";
import { useState } from "react";
    
export default function PlatformAccordionTabHeader({platformId, onChange}: {platformId: number, onChange?: () => void}) {
    const [ showItemModal, setShowItemModal ] = useState(false);

    return (
        <>
        <div className="flex flex-1 justify-between items-center">
            <Button label="Add Item" onClick={() => setShowItemModal(true)} />
        </div>
        <ItemModal
            visible={showItemModal} 
            onHide={() => setShowItemModal(false)} 
            onSave={({item, rate}) => {
                addStationPlatformItem(platformId, item.className, rate);
                if (onChange) { onChange() }
            }}
        />
        </>
    );
}