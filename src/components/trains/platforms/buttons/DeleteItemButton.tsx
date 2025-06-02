'use client';
import { removeStationPlatformItem } from "@/lib/services/stationPlatforms";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";

export function DeleteItemButton({platformId, itemId}: {platformId: number, itemId: number}) {
    const toast = useRef<Toast>(null);

    const onClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await removeStationPlatformItem(platformId, itemId);
        } catch (err) {
            if (err instanceof Error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: err.message });
            } else {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'An unknown error occurred' });
            }
        }
    }

    return (
        <>
            <Toast ref={toast} />
            <Button onClick={onClick} severity="danger" title="Delete item" icon="pi pi-trash" className="p-1 pt-1.5 w-8" size="small" outlined/>
        </>
    )
}