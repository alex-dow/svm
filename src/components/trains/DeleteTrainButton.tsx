'use client';

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ButtonWithBusyModal from "../buttons/ButtonWithBusyModal";
import { handleDeleteTrain } from "@/lib/actions/trains";

export interface DeleteTrainButtonProps {
    trainId: number,
    projectId: number
}

export default function DeleteTrainButton({trainId, projectId}: DeleteTrainButtonProps) {

    const params = useParams<{trainId?: string}>();
    const router = useRouter();

    const onDelete = async () => {
        await handleDeleteTrain(trainId);
      
        if (params.trainId && params.trainId === trainId.toString()) {
            router.push('/projects/' + projectId + '/trains');
        }
    }

    return (
        <ButtonWithBusyModal icon="pi pi-trash" severity="danger" onClick={onDelete} progressMessage="Deleting ..."/>
    )
}