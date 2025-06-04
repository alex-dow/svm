'use server';
import { getDatabase } from "@/server/db";
import { getCurrentUser } from "./auth";
import { revalidateTag, unstable_cache } from "next/cache";
import { CreateTrainStationPlatform } from "@/server/db/schemas/trainStations";



export async function getStationPlatforms(stationId: number, ownerId: string) {
    const db = getDatabase();

    return await db
        .selectFrom('train_station_platform')
        .selectAll()
        .where('train_station_id','=',stationId)
        .where('owner_id','=',ownerId)
        .orderBy('position','asc')
        .execute();
}

export const getCachedStationPlatforms = unstable_cache(
    async (stationId: number, ownerId: string) => getStationPlatforms(stationId, ownerId),
    ['station-platforms'],
    {
        tags: ['station-platforms']
    }
);


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

export async function addStationPlatforms(stationId: number, platforms: number) {
    if (platforms == 0) {
        return [];
    }
    const db = getDatabase();
    const owner = await getCurrentUser();
    if (!owner) throw new Error('Unauthorized');

    const lastPlatformPosition = await getLastPlatformPosition(stationId);
    
    const platformValues: CreateTrainStationPlatform[] = [];
    for (let i = 1; i <= platforms; i++) {
        platformValues.push({
            mode: 'loading',
            owner_id: owner.id,
            position: lastPlatformPosition + i,
            train_station_id: stationId
        })
    }
    
    const res = await db
        .insertInto('train_station_platform')
        .values(platformValues)
        .returningAll()
        .execute();

    revalidateTag('station-platforms');
    return res;
    
}

export async function addStationPlatform(stationId: number) {
    const db = getDatabase();
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }

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
            owner_id: owner.id,
            mode: 'loading',
        })
        .returningAll()
        .executeTakeFirst();

    revalidateTag('station-platforms');
    return platform;
}

export async function getStationPlatformProjectId(platformId: number) {
    const db = getDatabase();
    const platform = await db
        .selectFrom('train_station_platform')
        .leftJoin('train_station', 'train_station.id', 'train_station_platform.train_station_id')
        .select('train_station_id')
        .select('train_station.project_id')
        .where('id','=',platformId)
        .executeTakeFirst();
    return platform?.project_id;
}

export async function countStationPlatforms(stationId: number) {
    const db = getDatabase();
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }
    
    const res = await db
        .selectFrom('train_station_platform')
        .select(({fn}) => {
            return [
                fn.count<number>('id').as('platform_count')
            ]
        })
        .where('owner_id','=',owner.id)
        .where('train_station_id','=',stationId)
        .executeTakeFirst();
    return res?.platform_count || 0;       
}

export async function repositionStationPlatform(platformId: number, newPosition: number) {


    console.log('repositionStationPlatform', platformId, newPosition);
    const db = getDatabase();
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }

    const platform = await db
        .selectFrom('train_station_platform')
        .leftJoin('train_station', 'train_station.id', 'train_station_platform.train_station_id')
        .select('train_station.project_id')
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
        db.updateTable('train_station_platform')
        .set((eb) => ({
            position: eb('position','+',1)
        }))
        .where('position','<',platform.position)
        .where('position','>=',newPosition)
        .where('train_station_id','=',platform.train_station_id)
        .execute();
    } else if (newPosition > platform.position) {
        db.updateTable('train_station_platform')
        .set((eb) => ({
            position: eb('position', '-', 1)
        }))
        .where('position','>',platform.position)
        .where('position','<=',newPosition)
        .where('train_station_id','=',platform.train_station_id)
        .execute();
    }

    db.updateTable('train_station_platform')
    .set({
        position: newPosition
    })
    .where('id', '=', platformId).execute();

    revalidateTag('station-platforms');

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

    revalidateTag('station-platforms');
}

export async function removeStationPlatform(platformId: number) {
    const db = getDatabase();
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }

    const platform = await db
        .selectFrom('train_station_platform')
        .select('owner_id')
        .select('position')
        .select('train_station_id')
        .where('id','=',platformId)
        .executeTakeFirst();

    if (!platform) { throw new Error('Platform not found'); }
    if (platform.owner_id !== owner.id) { throw new Error('Unauthorized'); }

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
    revalidateTag('station-platforms');
}

export async function addStationPlatformItem(platformId: number, itemId: string, rate: number) {
    const db = getDatabase();
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }

    const platform = await db
        .selectFrom('train_station_platform')
        .select('owner_id')
        .select('position')
        .select('train_station_id')
        .select('id')
        .where('id','=',platformId)
        .executeTakeFirst();

    if (!platform) { throw new Error('Platform not found'); }
    if (platform.owner_id !== owner.id) { throw new Error('Unauthorized'); }

    await db.insertInto('train_station_platform_item').values({
        item_id: itemId,
        owner_id: platform.owner_id,
        platform_id: platform.id,
        rate: rate,
    }).execute();
    revalidateTag('items');
}

export const getPlatformItems = unstable_cache(async (platformId: number) => {
    const db = getDatabase();
    return await db.selectFrom('train_station_platform_item').selectAll().where('platform_id','=',platformId).execute();
}, ['items'], {tags: ['items']});

export const removeStationPlatformItem = async (platformId: number, itemId: number) => {
    const db = getDatabase();
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }    

    const item = await db.selectFrom('train_station_platform_item').selectAll().where('id','=',itemId).executeTakeFirst();
    if (!item) { throw new Error('Item not found'); }
    if (item.owner_id !== owner.id) { throw new Error('Unauthorized'); }

    await db.deleteFrom('train_station_platform_item').where('id','=',itemId).execute();
    revalidateTag('items');
}