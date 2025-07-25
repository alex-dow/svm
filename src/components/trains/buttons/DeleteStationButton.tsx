'use client';

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { handleDeleteTrainStation } from "@/lib/actions/trainStations";
import ConfirmButton from "@/components/buttons/ConfirmButton";

export interface DeleteStationButtonProps {
    stationId: number,
    projectId: number
}

export default function DeleteStationButton({stationId, projectId}: DeleteStationButtonProps) {

    const params = useParams<{stationId?: string}>();
    const router = useRouter();

    const onDelete = async () => {
        await handleDeleteTrainStation(stationId);
      
        if (params.stationId && params.stationId === stationId.toString()) {
            router.push('/projects/' + projectId + '/trains');
        }
    }

    return (
        <ConfirmButton icon="pi pi-trash" severity="danger" accept={onDelete} message="Are you sure you want to delete this station?" outlined/>
    )
}