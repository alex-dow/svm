import { getDatabase } from "@/server/db";
import { getCurrentUser } from "./auth";
import { Train } from "@/server/db/schemas/trains";
import { unstable_cache } from "next/cache";
import { StationMode, StopWithStation } from "../types";
import { ItemType } from "../satisfactory/data";

export async function getTrains(projectId: number, ownerId: string) {
    return getDatabase()
    .selectFrom('train')
    .selectAll()
    .where('project_id','=',projectId)
    .where('owner_id','=',ownerId)
    .execute();
}

export const getCachedTrains = (projectId: number, ownerId: string) => unstable_cache(
    async (projectId, ownerId) => getTrains(projectId, ownerId),
    ['trains'],
    {
        tags: [`trains:${projectId}`]
    }
)(projectId, ownerId)

export async function createTrain(name: string, projectId: number, ownerId: string) {
    return getDatabase()
    .insertInto('train')
    .values({
        name,
        project_id: projectId,
        owner_id: ownerId,
        wagons: 0
    })
    .returningAll()
    .executeTakeFirst();
}

export async function createTrains(names: string[], projectId: number): Promise<Train[]> {

    const db = getDatabase();
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }

    const res = db.insertInto('train').values(
        names.map((name) => ({
            name,
            owner_id: owner.id,
            project_id: projectId,
            wagons: 0
        }))
    ).returningAll().execute();
    return res;
}



export async function deleteTrain(trainId: number, ownerId: string) {
    return getDatabase()
    .deleteFrom('train')
    .where('id','=',trainId)
    .where('owner_id','=',ownerId)
    .execute();
}

export async function getTrain(trainId: number, ownerId: string) {
    return getDatabase()
    .selectFrom('train')
    .selectAll()
    .where('id','=',trainId)
    .where('owner_id','=',ownerId)
    .executeTakeFirst();
}

export const getCachedTrain = (trainId: number, ownerId: string) => unstable_cache(
    async (trainId, ownerId) => getTrain(trainId, ownerId),
    ['train'],
    {
        tags: [`train:${trainId}`]
    }
)(trainId, ownerId)

export async function updateTrain(train: Train) {
    const db = getDatabase();

    return db.updateTable('train').set({
        name: train.name,
        wagons: train.wagons
    })
    .returningAll()
    .where('id','=',train.id)
    .executeTakeFirst();
}


export async function getTrainTimetable(trainId: number, ownerId: string): Promise<StopWithStation[]> {
    return getDatabase()
    .selectFrom('train_timetable_stop')
    .innerJoin('train_station','train_timetable_stop.station_id','train_station.id')
    .select('train_timetable_stop.id as id')
    .select('train_timetable_stop.station_id as station_id')
    .select('train_station.name as station_name')
    .select('train_timetable_stop.position as position')
    .select('train_timetable_stop.consist_id as consist_id')
    .where('consist_id', '=', trainId)
    .where('train_timetable_stop.owner_id','=', ownerId)
    .orderBy('position','asc')
    .execute();
}



export async function getTrainTimetableStop(stopId: number, ownerId: string): Promise<StopWithStation | undefined> {
    return getDatabase()
    .selectFrom('train_timetable_stop')
    .innerJoin('train_station','train_station.id','train_timetable_stop.station_id')
    .select('train_timetable_stop.id as id')
    .select('station_id')
    .select('consist_id')
    .select('position')
    .select('train_station.name as station_name')
    .where('train_timetable_stop.id','=',stopId)
    .where('train_timetable_stop.owner_id','=',ownerId)
    .executeTakeFirst();
}

export const getCachedTrainTimetable = (trainId: number, ownerId: string) => unstable_cache(
    async (trainId, ownerId) => getTrainTimetable(trainId, ownerId),
    ['train-timetable'],
    {
        tags: [`train-timetable`,`train-timetable:${trainId}`]
    }
)(trainId, ownerId);

export async function getLastTimetableStop(trainId: number, ownerId: string) {
    return getDatabase()
    .selectFrom('train_timetable_stop')
    .selectAll()
    .where('consist_id', '=', trainId)
    .where('owner_id','=', ownerId)
    .orderBy('position','desc')
    .limit(1)
    .executeTakeFirst();
}

export async function addTimetableStop(trainId: number, stationId: number, ownerId: string) {
    const lastStop = await getLastTimetableStop(trainId, ownerId);
    const position = (lastStop) ? lastStop.position + 1 : 1;

    return getDatabase()
    .insertInto('train_timetable_stop')
    .values({
        consist_id: trainId,
        owner_id: ownerId,
        position: position,
        station_id: stationId
    })
    .returningAll()
    .executeTakeFirst();
}

export async function addTimetableStops(trainId: number, stationIds: number[], ownerId: string) {
    const lastStop = await getLastTimetableStop(trainId, ownerId);
    const position = (lastStop) ? lastStop.position + 1 : 1;   

    return getDatabase()
    .insertInto('train_timetable_stop')
    .values(stationIds.map((stationId, idx) => ({
        consist_id: trainId,
        owner_id: ownerId,
        position: position + idx,
        station_id: stationId
    })))
    .returningAll()
    .execute();
}

export async function repositionTimetableStop(stopId: number, newPosition: number, ownerId: string) {

    const db = getDatabase();
    const stop = await db
    .selectFrom('train_timetable_stop')
    .select(['position','consist_id'])
    .where('id','=',stopId)
    .where('owner_id','=',ownerId)
    .executeTakeFirstOrThrow();

    if (newPosition < stop.position) {
        await db.updateTable('train_timetable_stop')
        .set((eb) => ({
            position: eb('position','+',1)
        }))
        .where('position','<',stop.position)
        .where('position','>=',newPosition)
        .where('consist_id','=',stop.consist_id)
        .where('owner_id','=',ownerId)
        .execute();
    } else if (newPosition > stop.position) {
        await db.updateTable('train_timetable_stop')
        .set((eb) => ({
            position: eb('position','-',1)
        }))
        .where('position','>',stop.position)
        .where('position','<=',newPosition)
        .where('consist_id','=',stop.consist_id)
        .where('owner_id','=',ownerId)
        .execute();
    }

    await db.updateTable('train_timetable_stop')
    .set({
        position: newPosition
    })
    .where('id','=',stopId)
    .where('owner_id','=',ownerId)
    .execute();
}

export async function addTimetableStopItem(stopId: number, itemId: ItemType, mode: StationMode, ownerId: string) {
    return getDatabase()
    .insertInto('train_timetable_stop_item')
    .values({
        item_id: itemId,
        stop_id: stopId,
        owner_id: ownerId,
        mode: mode
    })
    .returningAll()
    .executeTakeFirst();
}

export async function addTimetbleStopItems(stopId: number, items: {itemId: ItemType, mode: StationMode}[], ownerId: string) {
    return getDatabase()
    .insertInto('train_timetable_stop_item')
    .values(items.map(item => ({
        item_id: item.itemId,
        stop_id: stopId,
        owner_id: ownerId,
        mode: item.mode
    })))
    .returningAll()
    .execute();
}

export async function removeTimetableStopItem(stopItemId: number, ownerId: string) {
    return getDatabase()
    .deleteFrom('train_timetable_stop_item')
    .where('id','=',stopItemId)
    .where('owner_id','=',ownerId)
    .execute();
}

export async function getTimetableStopItems(stopId: number, ownerId: string) {
    return getDatabase()
    .selectFrom('train_timetable_stop_item')
    .selectAll()
    .where('stop_id','=',stopId)
    .where('owner_id','=',ownerId)
    .execute();
}

export async function getTimetableStopItem(stopItemId: number, ownerId: string) {
    return getDatabase()
    .selectFrom('train_timetable_stop_item')
    .selectAll()
    .where('id','=',stopItemId)
    .where('owner_id','=',ownerId)
    .executeTakeFirst();
}

export const getCachedTimetableStopItems = (stopId: number, ownerId: string) => unstable_cache(
    async (stopId, ownerId) => getTimetableStopItems(stopId, ownerId),
    ['timetable-stop-items'],
    {
        tags: [`timetable-stop-items:${stopId}`]
    }
)(stopId, ownerId);

export async function removeTimetableStop(stopId: number, ownerId: string) {

    const db = getDatabase();

    const stop = await db
        .selectFrom('train_timetable_stop')
        .select(['position','consist_id'])
        .where('id','=',stopId)
        .executeTakeFirstOrThrow();

    await getDatabase()
    .deleteFrom('train_timetable_stop')
    .where('id','=',stopId)
    .where('owner_id','=',ownerId)
    .execute();

    await db
    .updateTable('train_timetable_stop')
    .set((eb) => ({
        position: eb('position','-',1)
    }))
    .where('owner_id','=',ownerId)
    .where('consist_id','=',stop.consist_id)
    .where('position', '>', stop.position)
    .execute();


}


