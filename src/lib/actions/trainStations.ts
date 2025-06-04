'use server';
import { revalidateTag } from "next/cache";
import { getCurrentUser } from "../services/auth";
import { deleteTrainStation,  getCachedTrainStation,  getCachedTrainStations,  getTrainStation, importStations } from "../services/stations";
import { SaveFileTrainStation } from "../types";

export async function handleGetTrainStations(projectId: number) {
    const user = await getCurrentUser();
    return getCachedTrainStations(projectId, user.id);
}

export async function handleGetTrainStation(trainStationId: number) {
    const user = await getCurrentUser();
    return getCachedTrainStation(trainStationId, user.id);
}

export async function handleDeleteTrainStation(trainStationId: number) {
    const user = await getCurrentUser();
    const station = await getTrainStation(trainStationId, user.id);
    if (!station) throw new Error('Station not found');
    await deleteTrainStation(trainStationId);
    revalidateTag(`train-stations:${station.project_id}`);
}


export async function handleImportTrainStations(stations: SaveFileTrainStation[], projectId: number) {
    const user = await getCurrentUser();
    await importStations(stations, projectId, user.id);
    revalidateTag(`train-stations:${projectId}`);
}

