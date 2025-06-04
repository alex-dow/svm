'use client';

import { handleMovePlatform } from "@/lib/actions/trainStations";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";

export interface MovePlatformButtonProps {
    disabled?: boolean,
    platformId: number,
    position: number,
    direction: 'up' | 'down'
}

export function MovePlatformButton(props: MovePlatformButtonProps) {
    const icon = (props.direction == 'up') ? 'pi pi-arrow-up' : 'pi pi-arrow-down';
    const title = (props.direction == 'up') ? 'Move platform up' : 'Move platform down';

    const toast = useRef<Toast>(null);

    const onClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        
        try {
            await handleMovePlatform(props.platformId, props.direction);
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
            severity="info"
            icon={icon}
            title={title}
            className="p-1 pt1.5 w-8"
            disabled={props.disabled}
            onClick={onClick}
        />
        </>
    );
}