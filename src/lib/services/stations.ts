import { getDatabase } from "@/server/db";
import { getCurrentUser } from "./auth";
import { CreateTrainStation } from "@/server/db/schemas/trainStations";
import { unstable_cache } from "next/cache";
import { NetworkOverviewItem } from "../types";
import { ItemType } from "../satisfactory/data";

export async function getTrainStations(projectId: number, ownerId: string) {
    return getDatabase()
    .selectFrom('train_station')
    .select('id')
    .select('name')
    .where('project_id', '=', projectId)
    .where('owner_id', '=', ownerId)
    .orderBy('name', 'asc')
    .execute();
}

export const getCachedTrainStations = (projectId: number, ownerId: string) => unstable_cache(
    async (projectId: number, ownerId: string) => getTrainStations(projectId, ownerId),
    ['train-stations'],
    { 
        tags: [`train-stations:${projectId}`,`train-stations:${projectId}:${ownerId}`]
    }
)(projectId, ownerId);

export async function createTrainStation(stationName: string, projectId: number, ownerId: string) {
    return getDatabase()
    .insertInto('train_station')
    .values({
        name: stationName,
        project_id: projectId,
        owner_id: ownerId
    })
    .returningAll()
    .executeTakeFirst();
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

export async function getAllTrainStationItems(stationId: number, ownerId: string): Promise<NetworkOverviewItem[]> {
    return getDatabase()
    .selectFrom('train_station_platform_item')
    .innerJoin('train_station_platform','train_station_platform_item.platform_id','train_station_platform.id')
    .innerJoin('train_station','train_station_platform.train_station_id','train_station.id')
    .select('train_station_platform_item.id as id')
    .select('train_station_platform_item.item_classname as item_classname')
    .select('train_station.id as station_id')
    .select('train_station_platform.mode as mode')
    .select('train_station_platform.position as position')
    .select('train_station_platform_item.rate as rate')
    .where('train_station.id','=',stationId)
    .where('train_station_platform_item.owner_id', '=', ownerId)
    .execute();

}

export const getCachedAllTrainStationItems = (stationId: number, ownerId: string) => unstable_cache(
    async (stationId, ownerId) => getAllTrainStationItems(stationId, ownerId),
    ['train-station-items'],
    {
        tags: [`train-station-items:${stationId}`]
    }
)(stationId, ownerId);

export async function getStationsByItemClassname(itemClassName: ItemType, projectId: number, ownerId: string) {
    return getDatabase()
    .selectFrom('train_station_platform_item')
    .innerJoin('train_station_platform','train_station_platform.id','train_station_platform_item.platform_id')
    .innerJoin('train_station','train_station.id','train_station_platform.train_station_id')
    .select('train_station_platform_item.id as item_id')
    .select('train_station_platform_item.rate as rate')
    .select('train_station_platform_item.item_classname as item_classname')
    .select('train_station_platform.position as position')
    .select('train_station_platform.mode as platform_mode')
    .select('train_station.name as station_name')
    .select('train_station.id as station_id')
    .where('item_classname','=',itemClassName)
    .where('train_station.project_id','=',projectId)
    .where('train_station_platform_item.owner_id','=',ownerId)
    .execute();
}

export type StationsByItem = Awaited<ReturnType<typeof getStationsByItemClassname>>;
export type StationByItem = StationsByItem[0];