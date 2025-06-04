'use client';
import { handleAddPlatform } from "@/lib/actions/trainStations";
import { Button } from "primereact/button";

export interface AddPlatformButtonProps {
    stationId: number
}

export default function AddPlatformButton({stationId}: AddPlatformButtonProps) {

    const onClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await handleAddPlatform(stationId);
    }

    return (
        <Button label="Add platform" onClick={onClick} />
    );

}