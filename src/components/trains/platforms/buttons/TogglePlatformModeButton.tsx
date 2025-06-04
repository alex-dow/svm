'use client';

import { handleSetPlatformMode } from "@/lib/actions/trainStations";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";

export function TogglePlatformModeButton({platformId, mode}: {platformId: number, mode: 'loading' | 'unloading'}) {

    const toast = useRef<Toast>(null);

    const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        try {
            e.stopPropagation();
            await handleSetPlatformMode(platformId, (mode === 'loading') ? 'unloading' : 'loading');
        } catch (err) {
            console.error(err);
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
        <Button
            outlined
            severity="secondary"
            size="small"
            icon="pi pi-arrow-right-arrow-left"
            className="p-1 pt-1.5 w-8"
            title="Toggle platform mode"
            onClick={onClick}
        />
        </>
    );
}