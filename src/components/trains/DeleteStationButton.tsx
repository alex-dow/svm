'use client';

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ButtonWithBusyModal from "../buttons/ButtonWithBusyModal";
import { deleteTrainStation } from "@/lib/services/stations";

export interface DeleteStationButtonProps {
    stationId: number,
    projectId: number
}

export default function DeleteStationButton({stationId, projectId}: DeleteStationButtonProps) {

    const params = useParams<{stationId?: string}>();
    const router = useRouter();

    const onDelete = async () => {
        await deleteTrainStation(stationId);
      
        if (params.stationId && params.stationId === stationId.toString()) {
            router.push('/projects/' + projectId + '/trains');
        }
    }

    return (
        <ButtonWithBusyModal icon="pi pi-trash" severity="danger" onClick={onDelete} progressMessage="Deleting ..."/>
    )
}