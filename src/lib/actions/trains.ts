'use server';

import { revalidateTag } from "next/cache";
import { getCurrentUser } from "../services/auth";
import { createTrain, deleteTrain, getCachedTrain, getCachedTrains, getTrain, updateTrain } from "../services/trains";

export async function handleGetTrain(trainId: number) {
    const user = await getCurrentUser();
    return getCachedTrain(trainId, user.id);
}

export async function handleGetTrains(projectId: number) {
    const user = await getCurrentUser();
    return getCachedTrains(projectId, user.id);
}

export async function handleDeleteTrain(trainId: number) {
    const user = await getCurrentUser();
    const train = await getTrain(trainId, user.id);
    if (!train) {
        throw new Error('Train not found');
    }

    await deleteTrain(train.id, user.id);
    revalidateTag(`trains:${train.project_id}`)
}

export async function handleRenameTrain(trainId: number, name: string) {
    const user = await getCurrentUser();
    const train = await getTrain(trainId, user.id);
    if (!train) {
        throw new Error('Train not found');
    }

    const newTrain = updateTrain({...train, name});
    revalidateTag(`trains:${train.project_id}`);
    revalidateTag(`train:${train.id}`);
    return newTrain;
}

export async function handleCreateTrain(projectId: number, name: string) {
    const user = await getCurrentUser();
    const train = await createTrain(projectId, name, user.id);
    revalidateTag(`trains:${projectId}`)
    return train;
}