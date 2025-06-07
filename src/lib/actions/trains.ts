'use server';

import { revalidateTag } from "next/cache";
import { getCurrentUser } from "../services/auth";
import { addTimetableStop, addTimetableStopItem, addTimetbleStopItems, createTrain, deleteTrain, getCachedTimetableStopItems, getCachedTrain, getCachedTrains, getCachedTrainTimetable, getTimetableStopItem, getTrain, getTrainTimetableStop, removeTimetableStop, removeTimetableStopItem, updateTrain } from "../services/trains";
import { StationMode } from "../types";

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

export async function handleCreateTrain(name: string, projectId: number) {
    const user = await getCurrentUser();
    const train = await createTrain(name, projectId, user.id);
    revalidateTag(`trains:${projectId}`)
    return train;
}

export async function handleGetTimetable(trainId: number) {
    const user = await getCurrentUser();
    return getCachedTrainTimetable(trainId, user.id);
}

export async function handleRemoveStop(stopId: number) {
    const user = await getCurrentUser();
    const stop = await getTrainTimetableStop(stopId, user.id);
    if (!stop) throw new Error('Timetable stop not found');
    await removeTimetableStop(stopId, user.id);
    revalidateTag(`train-timetable:${stop.consist_id}`)
}


export interface HandleAddStopParams {
    trainId: number,
    stationId: number,
    loadingItems?: string[],
    unloadingItems?: string[]
}

export async function handleAddStop({trainId, stationId, loadingItems, unloadingItems}: HandleAddStopParams) {
    const user = await getCurrentUser();
    
    const stop = await addTimetableStop(trainId, stationId, user.id);
    
    if (!stop) throw new Error('Failed to create the timetable stop');

    console.log('new stop:', stop.id);

    if (loadingItems) {
        await Promise.all(
            loadingItems.map(
                (item) => addTimetableStopItem(stop.id, item, 'loading', user.id)
            )
        );
    }

    if (unloadingItems) {
        await Promise.all(
            unloadingItems.map(
                (item) => addTimetableStopItem(stop.id, item, 'unloading', user.id)
            )
        )
    }

    revalidateTag(`train-timetable:${trainId}`);
}

export async function handleGetStopItems(stopId: number) {
    const user = await getCurrentUser();

    return getCachedTimetableStopItems(stopId, user.id);
}

export async function handleRemoveStopItem(stopItemId: number) {
    const user = await getCurrentUser();
    const stopItem = await getTimetableStopItem(stopItemId, user.id);
    if (!stopItem) throw new Error('Timetable stop item not found');
    await removeTimetableStopItem(stopItemId, user.id);
    revalidateTag(`timetable-stop-items:${stopItem.stop_id}`);
}

export async function handleAddStopItem(stopId: number, itemId: string, mode: StationMode) {
    const user = await getCurrentUser();
    await addTimetableStopItem(stopId, itemId, mode, user.id);
    revalidateTag(`timetable-stop-items:${stopId}`)
}

export async function handleAddStopItems(stopId: number, items: {itemId: string, mode: StationMode}[]) {
    const user = await getCurrentUser();
    await addTimetbleStopItems(stopId, items, user.id);
    revalidateTag(`timetable-stop-items:${stopId}`)
}