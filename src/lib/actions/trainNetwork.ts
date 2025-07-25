'use server';
import { revalidateTag } from "next/cache";
import { getCurrentUser } from "../services/auth";
import { getCachedTrainNetworkItems, rebuildTrainNetwork } from "../services/trainNetwork";


export const handleGetTrainNetworkItems = async (projectId: number) => {
    const user = await getCurrentUser();
    return getCachedTrainNetworkItems(projectId, user.id);
}

export const handleRebuildTrainNetwork = async (projectId: number) => {
    const user = await getCurrentUser();
    await rebuildTrainNetwork(projectId, user.id);
    revalidateTag(`train-network:${projectId}`);
}