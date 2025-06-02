'use server';

import { getDatabase } from "@/server/db";
import { getCurrentUser } from "./auth";
import { CreateTrainStation, CreateTrainStationPlatform } from "@/server/db/schemas/trainStations";
import { SaveFilePlatform } from "../types";

export async function importStations(stations: {id: string, label: string, platforms: SaveFilePlatform[]}[], projectId: number) {
    const db = getDatabase();
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }
    
    const trainStations = await db
        .insertInto('train_station')
        .values(stations.map((s) => ({name: s.label, owner_id: owner.id, project_id: projectId})))
        .returningAll()
        .execute();

    const platforms = stations.reduce((a, s, idx) => {

        if (s.platforms.length > 0) {
            for (let i = 1; i <= s.platforms.length; i++) {
                a.push({
                    mode: s.platforms[i-1].mode ? 'loading' : 'unloading',
                    owner_id: owner.id,
                    train_station_id: trainStations[idx].id,
                    position: i
                });
            }
        }

        return a;
    }, [] as CreateTrainStationPlatform[])

    if (platforms.length > 0) {
        await db
            .insertInto('train_station_platform')
            .values(platforms)
            .returningAll()
            .execute();
    }

    return trainStations;
}

export async function getTrainStations(projectId: number) {
    const db = getDatabase();
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }

    const stations = await db
        .selectFrom('train_station')
        .select('id')
        .select('name')
        .where('project_id', '=', projectId)
        .where('owner_id', '=', owner.id)
        .execute();

    return stations;
}

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

export async function getTrainStation(stationId: number) {
    const db = getDatabase();
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }

    const station = await db.selectFrom('train_station').selectAll().where('id','=',stationId).executeTakeFirst();
    if (!station) { throw new Error('Station not found'); }
    if (station.owner_id !== owner.id) { throw new Error('Unauthorized'); }

    return station;
}