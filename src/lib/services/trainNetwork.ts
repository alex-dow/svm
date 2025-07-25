import { getDatabase } from "@/server/db";
import { ItemType } from "../satisfactory/data";
import { StationMode } from "../types";
import { unstable_cache } from "next/cache";
import { CreateTrainNetworkItem } from "@/server/db/schemas/trains";

export interface GetTrainNetworkItemById {
    itemId: number;
    ownerId: string;
}

export interface GetTrainNetworkItemByName {
    projectId: number;
    itemClassname: ItemType;
    ownerId: string;
    platformPosition: number;
}


export type GetTrainNetworkItemOptions = GetTrainNetworkItemById | GetTrainNetworkItemByName;

export async function getTrainNetworkItem(options: GetTrainNetworkItemOptions) {

    if ("itemId" in options) {
        return getDatabase()
        .selectFrom('train_network_items')
        .selectAll()
        .where('id','=',options.itemId)
        .where('owner_id','=',options.ownerId)
        .executeTakeFirst();
    } else {
        return getDatabase()
        .selectFrom('train_network_items')
        .selectAll()
        .where('project_id','=',options.projectId)
        .where('item_classname','=',options.itemClassname as ItemType)
        .where('owner_id','=',options.ownerId)
        .where('platform_position','=',options.platformPosition)
        .executeTakeFirst();
    }
}

export async function getTrainNetworkItems(projectId: number, ownerId: string) {
    return getDatabase()
    .selectFrom('train_network_items')
    .selectAll()
    .where('project_id','=',projectId)
    .where('owner_id','=',ownerId)
    .execute();
}

export const getCachedTrainNetworkItems = (projectId: number, ownerId: string) => unstable_cache(
    async (projectId: number, ownerId: string) => getTrainNetworkItems(projectId, ownerId),
    ['train-network'],
    {
        tags: [`train-network:${projectId}`]
    }
)(projectId, ownerId);

export async function removeTrainNetworkItemAmount(projectId: number, itemClassname: ItemType, mode: StationMode, rate: number, platformPosition: number, ownerId: string) {

    const existingItem = await getTrainNetworkItem({projectId, itemClassname, ownerId, platformPosition});

    if (!existingItem) {
        throw new Error(`${itemClassname} is not in the train network`);
    }

    const newAvailablity = (mode === 'loading') ? existingItem.availability - rate : existingItem.availability + rate;
    const newValue = (mode === 'loading') ? { loading_rate: existingItem.loading_rate - rate } : { unloading_rate: existingItem.unloading_rate - rate };


    return getDatabase()
    .updateTable('train_network_items')
    .set(newValue)
    .set({availability: newAvailablity})
    .where('id','=',existingItem.id)
    .where('owner_id','=',ownerId)
    .returningAll()
    .executeTakeFirst();
    
}
 

export async function addTrainNetworkItemAmount(projectId: number, itemClassname: ItemType, mode: StationMode, rate: number, platformPosition: number, ownerId: string, ) {

    const existingItem = await getTrainNetworkItem({projectId, itemClassname, ownerId, platformPosition});



    if (existingItem) {
        return getDatabase()
        .updateTable('train_network_items')
        .set(() => {
            if (mode === 'loading') {
                return {
                    loading_rate: existingItem.loading_rate + rate
                }
            } else {
                return {
                    unloading_rate: existingItem.unloading_rate + rate
                }
            }
        })
        .set(() => {
            let availRate = existingItem.availability;
            if (mode === 'loading') {
                availRate = existingItem.availability + rate;
            } else {
                availRate = existingItem.availability - rate;
            }

            return {
                availability: availRate
            }
        })
        .where('id','=',existingItem.id)
        .returningAll()
        .executeTakeFirst();
    } else {
        return getDatabase()
        .insertInto('train_network_items')
        .values({
            project_id: projectId,
            owner_id: ownerId,
            loading_rate: (mode === 'loading') ? rate : 0,
            unloading_rate: (mode === 'unloading') ? rate : 0,
            availability: (mode === 'loading') ? rate : -rate,
            item_classname: itemClassname,
            platform_position: platformPosition,
        })
        .returningAll()
        .executeTakeFirst();
    }
}

export async function rebuildTrainNetwork(projectId: number, ownerId: string) {
    const db = getDatabase();

    await db.deleteFrom('train_network_items')
    .where('project_id', '=', projectId)
    .where('owner_id', '=', ownerId)
    .execute();

    const stations = await db
        .selectFrom('train_station')
        .select('id')
        .where('project_id', '=', projectId)
        .where('owner_id', '=', ownerId)
        .execute();

    let values = [] as CreateTrainNetworkItem[];

    for (const station of stations) {


        const items = await db.selectFrom('train_station_platform_item')
        .innerJoin('train_station_platform','train_station_platform_item.platform_id','train_station_platform.id')
        .innerJoin('train_station','train_station_platform.train_station_id','train_station.id')
        .select('train_station_platform_item.id as id')
        .select('train_station_platform_item.item_classname as item_classname')
        .select('train_station.id as station_id')
        .select('train_station_platform.mode as mode')
        .select('train_station_platform.position as position')
        .select('train_station_platform_item.rate as rate')
        .where('train_station.id','=',station.id)
        .where('train_station_platform_item.owner_id', '=', ownerId)
        .execute();

        values = items.reduce((a, item) => {
            const idx = a.findIndex((i) => i.item_classname === item.item_classname && i.platform_position === item.position);
            
            if (idx === -1) {
                a.push({
                    project_id: projectId,
                    owner_id: ownerId,
                    item_classname: item.item_classname,
                    loading_rate: (item.mode === 'loading') ? item.rate : 0,
                    unloading_rate: (item.mode === 'unloading') ? item.rate : 0,
                    availability: (item.mode === 'loading') ? item.rate : -item.rate,
                    platform_position: item.position,
                })
            } else {
                a[idx].loading_rate += (item.mode === 'loading') ? item.rate : 0;
                a[idx].unloading_rate += (item.mode === 'unloading') ? item.rate : 0;
                a[idx].availability += (item.mode === 'loading') ? item.rate : -item.rate;
            }
            return a;
        }, values);
    }

    if (values.length > 0) {
        await db.insertInto('train_network_items').values(values).execute();
    }
}