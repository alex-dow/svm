'use client';
import RowActionButton from "@/components/buttons/RowActionButton";

export interface EditTrainStationButton {
    stationId: number,
    onClick?: (e: React.MouseEvent, stationId: number) => void
}

export default function EditTrainStationButton({stationId, onClick}: EditTrainStationButton) {
    return (
        <RowActionButton icon="pi pi-pencil" onClick={(e) => onClick?.(e, stationId)} title="Edit station name" severity="info"/>
    );

}