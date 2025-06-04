import { getDatabase } from "@/server/db";
import { getCurrentUser } from "./auth";
import { CreateTrainStation } from "@/server/db/schemas/trainStations";
import { unstable_cache } from "next/cache";

export async function getTrainStations(projectId: number, ownerId: string) {
    return getDatabase()
    .selectFrom('train_station')
    .select('id')
    .select('name')
    .where('project_id', '=', projectId)
    .where('owner_id', '=', ownerId)
    .execute();
}

export const getCachedTrainStations = (projectId: number, ownerId: string) => unstable_cache(
    async (projectId: number, ownerId: string) => getTrainStations(projectId, ownerId),
    ['train-stations'],
    { 
        tags: [`train-stations:${projectId}`,`train-stations:${projectId}:${ownerId}`]
    }
)(projectId, ownerId);

export async function createTrainStation(stationName: string, projectId: number) {
    const db = getDatabase();
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }

    const station = await db.insertInto('train_station').values({
        name: stationName,
        project_id: projectId,
        owner_id: owner.id
    }).returningAll().executeTakeFirst();

    return station;
}

export async function createTrainStations(stationNames: string[], projectId: number) {
    const db = getDatabase();
    const owner = await getCurrentUser();
    if (!owner) throw new Error('Unauthorized');
    
    const insertables: CreateTrainStation[] = stationNames.map((stationName) => ({
        name: stationName,
        owner_id: owner.id,
        project_id: projectId
    }));

    const res = await db.insertInto('train_station').values(insertables).returningAll().execute();
    return res;
}

export async function deleteTrainStation(stationId: number) {
    const db = getDatabase();
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }

    const station = await db
        .selectFrom('train_station')
        .select('owner_id')
        .where('id','=',stationId)
        .executeTakeFirst();
    if (!station) { throw new Error('Station not found'); }
    if (station.owner_id !== owner.id) { throw new Error('Unauthorized'); }

    await db.deleteFrom('train_station').where('id','=',stationId).execute();
}

export async function getTrainStation(stationId: number, ownerId: string) {
    const db = getDatabase();

    const station = await db
        .selectFrom('train_station')
        .selectAll()
        .where('id','=',stationId)
        .where('owner_id','=',ownerId)
        .executeTakeFirst();
    if (!station) { throw new Error('Station not found'); }
    if (station.owner_id !== ownerId) { throw new Error('Unauthorized'); }

    return station;
}

export const getCachedTrainStation = (stationId: number, ownerId: string) => unstable_cache(
    async (stationId: number, ownerId: string) => getTrainStation(stationId, ownerId),
    ['train-station'],
    {
        tags: [`train-station:${stationId}`,`train-station:${stationId}:${ownerId}`]
    }
)(stationId, ownerId);

