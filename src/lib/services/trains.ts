import { getDatabase } from "@/server/db";
import { getCurrentUser } from "./auth";
import { Train } from "@/server/db/schemas/trains";
import { unstable_cache } from "next/cache";
import { StationMode } from "../types";

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

export async function getTrainTimetable(trainId: number, ownerId: string) {
    return getDatabase()
    .selectFrom('train_timetable_stop')
    .innerJoin('train_station','train_timetable_stop.station_id','train_station.id')
    .select('train_timetable_stop.id as id')
    .select('train_timetable_stop.station_id as station_id')
    .select('train_station.name as station_name')
    .where('consist_id', '=', trainId)
    .where('train_timetable_stop.owner_id','=', ownerId)
    .orderBy('position','asc')
    .execute();
}

export async function getTrainTimetableStop(stopId: number, ownerId: string) {
    return getDatabase()
    .selectFrom('train_timetable_stop')
    .innerJoin('train_station','train_station.id','train_timetable_stop.station_id')
    .select('id')
    .select('station_id')
    .select('train_station.name as station_name')
    .where('id','=',stopId)
    .where('owner_id','=',ownerId)
    .executeTakeFirst();
}

export const getCachedTrainTimetable = (trainId: number, ownerId: string) => unstable_cache(
    async (trainId, ownerId) => getTrainTimetable(trainId, ownerId),
    ['train-timetable'],
    {
        tags: [`train-timetable:${trainId}`]
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
    const position = (lastStop) ? lastStop.position : 1;

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

export async function addTimetableStopItem(stopId: number, itemId: string, mode: StationMode, ownerId: string) {
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
    return getDatabase()
    .deleteFrom('train_timetable_stop')
    .where('id','=',stopId)
    .where('owner_id','=',ownerId)
    .execute();
}

export async function getAllStationItems(stationId: number, ownerId: string) {
    return getDatabase()
    .selectFrom('train_station_platform_item')
}