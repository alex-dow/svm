'use server';
import { revalidateTag } from "next/cache";
import { getCurrentUser } from "../services/auth";
import { createTrainStation, deleteTrainStation,  getCachedAllTrainStationItems,  getCachedTrainStation,  getCachedTrainStations,  getTrainStation } from "../services/stations";
import { addStationPlatform, addStationPlatformItem, countStationPlatforms, getAllPlatformItems, getCachedTrainStationPlatforms, getStationPlatformItem, getStationPlatformItems, getTrainStationPlatform, removeStationPlatform, removeStationPlatformItem, repositionStationPlatform, setPlatformMode } from "../services/stationPlatforms";
import { ItemType } from "../satisfactory/data";


export async function handleGetTrainStations(projectId: number) {
    const user = await getCurrentUser();
    return getCachedTrainStations(projectId, user.id);
}

export async function handleCreateTrainStation(stationName: string, projectId: number) {
    const user = await getCurrentUser();
    const station = createTrainStation(stationName, projectId, user.id);
    revalidateTag(`train-stations:${projectId}`);
    return station;
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
    revalidateTag(`train-timetable`);
    
}

export async function handleGetStationPlatforms(trainStationId: number) {
    const user = await getCurrentUser();
    return getCachedTrainStationPlatforms(trainStationId, user.id);
}

export async function handleDeleteStationPlatform(platformId: number) {
    const user = await getCurrentUser();
    const platform = await getTrainStationPlatform(platformId, user.id);
    await removeStationPlatform(platformId, user.id);
    revalidateTag(`train-station-platforms:${platform?.train_station_id}`)
    revalidateTag(`train-station-items:${platform?.train_station_id}`);
}

export async function handleMovePlatform(platformId: number, direction: 'up' | 'down') {
    const user = await getCurrentUser();
    
    const platform = await getTrainStationPlatform(platformId, user.id);
    if (!platform) throw new Error('Platform not found');

    const totalPlatforms = await countStationPlatforms(platform?.train_station_id);

    if (direction === 'up' && platform.position === 1) {
        throw new Error('Platform is already at the top most position');
    }

    if (direction === 'down' && platform.position === totalPlatforms) {
        throw new Error('Platform is already at the bottom most position');
    }

    await repositionStationPlatform(platformId, (direction === 'up') ? platform.position - 1 : platform.position + 1);
    revalidateTag(`train-station-platforms:${platform.train_station_id}`);
}

export async function handleAddPlatform(trainStationId: number) {
    const user = await getCurrentUser();
    await addStationPlatform(trainStationId, user.id);
    revalidateTag(`train-station-platforms:${trainStationId}`)
}

export async function handleSetPlatformMode(platformId: number, mode: 'loading' | 'unloading') {
    const user = await getCurrentUser();
    const platform = await getTrainStationPlatform(platformId, user.id);
    if (!platform) throw new Error('Platform not found');

    await setPlatformMode(platformId, mode, user.id);

    revalidateTag(`train-station-platforms:${platform.train_station_id}`);
    revalidateTag(`train-station-items:${platform.train_station_id}`);
}

export async function handleGetPlatformItems(platformId: number) {
    const user = await getCurrentUser();

    return getStationPlatformItems(platformId, user.id);
    
}

export async function handleAddPlatformItem(platformId: number, itemId: ItemType, rate: number) {
    const user = await getCurrentUser();
    const platform = await getTrainStationPlatform(platformId, user.id);
    if (!platform) throw new Error('Platform not found');

    await addStationPlatformItem(platformId, itemId, rate, user.id);
    revalidateTag(`train-station-platform-items:${platformId}`)
    revalidateTag(`train-station-items:${platform.train_station_id}`);
}

export async function handleRemovePlatformItem(platformId: number, itemId: number) {
    const user = await getCurrentUser();
    const item = await getStationPlatformItem(itemId, user.id);
    if (!item) throw new Error('Platform item not found');
    
    const platform = await getTrainStationPlatform(platformId, user.id);
    

    await removeStationPlatformItem(itemId, user.id);
    revalidateTag(`train-station-platform-items:${platformId}`)
    revalidateTag(`train-station-items:${platform?.train_station_id}`);
}

export async function handleGetStationItems(stationId: number) {
    const user = await getCurrentUser();
    return getCachedAllTrainStationItems(stationId, user.id);
}

export async function handleGetAllPlatformItems(projectId: number) {
    const user = await getCurrentUser();
    return getAllPlatformItems(projectId, user.id);
}