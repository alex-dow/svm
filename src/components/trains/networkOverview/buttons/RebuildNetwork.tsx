'use client';
import RowActionButton from "@/components/buttons/RowActionButton";
import { handleRebuildTrainNetwork } from "@/lib/actions/trainNetwork";
import { useParams } from "next/navigation";

export default function RebuildNetwork() {

    const params = useParams();
    const projectId = Number(params.projectId);

    const handleRebuildNetwork = async () => {
        await handleRebuildTrainNetwork(projectId);
    }

    return (
        <RowActionButton onClick={handleRebuildNetwork} icon="pi pi-refresh" />
    )
}