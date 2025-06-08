import { getDatabase } from "@/server/db";
import { getCurrentUser } from "./auth";
import { unstable_cache } from "next/cache";
import { ItemType } from "../satisfactory/data";
import { NetworkOverviewItem } from "../types";

export async function getTrainStationPlatforms(stationId: number, ownerId: string) {
    return getDatabase()
    .selectFrom('train_station_platform')
    .selectAll()
    .where('train_station_id','=',stationId)
    .where('owner_id','=',ownerId)
    .orderBy('position','asc')
    .execute();
}

export const getCachedTrainStationPlatforms = (trainStationId: number, ownerId: string) => unstable_cache(
    async (stationId, ownerId) => getTrainStationPlatforms(stationId, ownerId),
    ['train-station-platforms'],
    {
        tags: [`train-station-platforms:${trainStationId}`]
    }
)(trainStationId, ownerId);

export async function getTrainStationPlatform(platformId: number, ownerId: string) {
    return getDatabase()
    .selectFrom('train_station_platform')
    .selectAll()
    .where('id','=',platformId)
    .where('owner_id','=',ownerId)
    .executeTakeFirst();
}

export async function getLastPlatformPosition(stationId: number) {
    const db = getDatabase();
    const lastPlatform = await db
        .selectFrom('train_station_platform')
        .select('position')
        .where('train_station_id','=',stationId)
        .orderBy('position','desc')
        .limit(1)
        .executeTakeFirst();
    return lastPlatform?.position || 0;
}

export async function countStationPlatforms(stationId: number) {
    const db = getDatabase();
    
    const res = await db
        .selectFrom('train_station_platform')
        .select(({fn}) => {
            return [
                fn.count<number>('id').as('platform_count')
            ]
        })
        .where('train_station_id','=',stationId)
        .executeTakeFirst();
    return res?.platform_count || 0;       
}

export async function addStationPlatform(stationId: number, ownerId: string) {
    const db = getDatabase();

    const lastPlatform = await db
        .selectFrom('train_station_platform')
        .select('position')
        .where('train_station_id','=',stationId)
        .orderBy('position','desc')
        .limit(1)
        .executeTakeFirst();

    const position = lastPlatform ? lastPlatform.position + 1 : 1;
        

    const platform = await db
        .insertInto('train_station_platform').values({
            position,
            train_station_id: stationId,
            owner_id: ownerId,
            mode: 'loading',
        })
        .returningAll()
        .executeTakeFirst();

    
    return platform;
}


export async function repositionStationPlatform(platformId: number, newPosition: number) {

    const db = getDatabase();
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }

    const platform = await db
        .selectFrom('train_station_platform')
        .select('train_station_platform.position')
        .select('train_station_platform.owner_id')
        .select('train_station_platform.train_station_id')
        .select('train_station_platform.mode')
        .where('train_station_platform.id','=',platformId)
        .executeTakeFirst();
    
    if (!platform) { throw new Error('Platform not found'); }
    if (platform.owner_id !== owner.id) { throw new Error('Unauthorized'); }

    const platformCount = await countStationPlatforms(platform.train_station_id);
    if (newPosition < 1 || newPosition > platformCount + 1) { 
        throw new Error('The desired position of ' + newPosition + ' is not valid. The platform must be between 1 and ' + platformCount + ' inclusive');
    }

    if (newPosition < platform.position) {
        await db.updateTable('train_station_platform')
        .set((eb) => ({
            position: eb('position','+',1)
        }))
        .where('position','<',platform.position)
        .where('position','>=',newPosition)
        .where('train_station_id','=',platform.train_station_id)
        .execute();
    } else if (newPosition > platform.position) {
        await db.updateTable('train_station_platform')
        .set((eb) => ({
            position: eb('position', '-', 1)
        }))
        .where('position','>',platform.position)
        .where('position','<=',newPosition)
        .where('train_station_id','=',platform.train_station_id)
        .execute();
    }

    await db.updateTable('train_station_platform')
    .set({
        position: newPosition
    })
    .where('id', '=', platformId).execute();


}

export async function setPlatformMode(platformId: number, mode: 'loading' | 'unloading', ownerId: string) {
    return getDatabase()
    .updateTable('train_station_platform')
    .set({
        mode
    })
    .where('id','=',platformId)
    .where('owner_id','=',ownerId)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function toggleStationPlatformMode(platformId: number) {
    const db = getDatabase();
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }

    const platform = await db
        .selectFrom('train_station_platform')
        .leftJoin('train_station', 'train_station.id', 'train_station_platform.train_station_id')
        .select('train_station.project_id')
        .select('train_station_platform.owner_id')
        .select('train_station_platform.train_station_id')
        .select('train_station_platform.mode')
        .where('train_station_platform.id','=',platformId)
        .executeTakeFirst();

    if (!platform) { throw new Error('Platform not found'); }
    if (platform.owner_id !== owner.id) { throw new Error('Unauthorized'); }

    await db
        .updateTable('train_station_platform')
        .set({ mode: platform.mode === 'loading' ? 'unloading' : 'loading' })
        .where('id','=',platformId)
        .execute();

}

export async function removeStationPlatform(platformId: number, ownerId: string) {
    const db = getDatabase();

    const platform = await db
        .selectFrom('train_station_platform')
        .select('owner_id')
        .select('position')
        .select('train_station_id')
        .where('id','=',platformId)
        .where('owner_id','=',ownerId)
        .executeTakeFirst();

    if (!platform) { throw new Error('Platform not found'); }

    await db.transaction().execute(async (tx) => {
        await tx.deleteFrom('train_station_platform').where('id','=',platformId).execute();
        await tx.updateTable('train_station_platform')
            .set((eb) => ({
                position: eb('position','-',1)
            }))
            .where('position','>',platform.position)
            .where('train_station_id','=',platform.train_station_id)
            .execute();
    });
}

export async function addStationPlatformItem(platformId: number, itemId: ItemType, rate: number, ownerId: string) {
    const db = getDatabase();

    await db.insertInto('train_station_platform_item').values({
        item_id: itemId,
        owner_id: ownerId,
        platform_id: platformId,
        rate: rate,
    }).execute();
}

export async function getStationPlatformItem(itemId: number, ownerId: string) {
    return getDatabase()
    .selectFrom('train_station_platform_item')
    .selectAll()
    .where('id','=',itemId)
    .where('owner_id','=',ownerId)
    .executeTakeFirst();
}

export async function getStationPlatformItems(platformId: number, ownerId: string) {
    return getDatabase()
    .selectFrom('train_station_platform_item')
    .selectAll()
    .where('platform_id','=',platformId)
    .where('owner_id','=',ownerId)
    .execute()
}

export const getCachedStationPlatformItems = (platformId: number, ownerId: string) => unstable_cache(
    async (platformId, ownerId) => getStationPlatformItems(platformId, ownerId),
    ['platform-items'],
    {
        tags: [`train-station-platform-items:${platformId}`]
    }
)(platformId, ownerId)



export async function getAllPlatformItems(projectId: number, ownerId: string): Promise<NetworkOverviewItem[]> {
    return getDatabase()
    .selectFrom('train_station')
    .innerJoin('train_station_platform', 'train_station_platform.train_station_id', 'train_station.id')
    .innerJoin('train_station_platform_item', 'train_station_platform_item.platform_id', 'train_station_platform.id')
    .select('train_station_platform_item.item_id')
    .select('train_station_platform_item.rate')
    .select('train_station_platform.mode')
    .select('train_station_platform.position')
    .select('train_station.id as station_id')
    .where('train_station.project_id','=',projectId)
    .where('train_station.owner_id','=',ownerId)
    .execute();
}

export const removeStationPlatformItem = async (itemId: number, ownerId: string) => {
    return getDatabase()
    .deleteFrom('train_station_platform_item')
    .where('id','=',itemId)
    .where('owner_id','=',ownerId)
    .execute();
}