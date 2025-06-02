'use server';

import { getDatabase } from "@/server/db";
import { getCurrentUser } from "./auth";
import { CreateTrainWagon } from "@/server/db/schemas/trains";

export async function getTrainWagons(trainId: number) {
    const db = getDatabase();
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }

    const res = await db.selectFrom('train_wagon')
    .selectAll()
    .where('train_wagon.consist_id', '=', trainId)
    .where('owner_id', '=', owner.id)
    .execute();
    return res;
}

export async function getLastWagonPosition(trainId: number) {
    const db = getDatabase();

    const res = await db.selectFrom('train_wagon')
    .select('position')
    .where('consist_id', '=', trainId)
    .executeTakeFirst();

    return res?.position || 0;
}

export async function addTrainWagon(trainId: number) {
    const db = getDatabase();
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }

    const res = await db.selectFrom('train_consist')
    .select('id')
    .where('id','=',trainId)
    .executeTakeFirst();
    if (!res) throw new Error('Unknown train consist: ' + trainId);

    const lastWagonPosition = await getLastWagonPosition(trainId);

    return db.insertInto('train_wagon').values({
        consist_id: trainId,
        owner_id: owner.id,
        position: lastWagonPosition + 1
    });
}

export async function addTrainWagons(trainId: number, wagons: number) {
    const db = getDatabase();
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }

    const res = await db.selectFrom('train_consist')
    .select('id')
    .where('id','=',trainId)
    .executeTakeFirst();
    if (!res) throw new Error('Unknown train consist: ' + trainId);

    const lastWagonPosition = await getLastWagonPosition(trainId);

    const wagonValues: CreateTrainWagon[] = [];

    for (let i = lastWagonPosition; i <= wagons; i++) {
        wagonValues.push({
            consist_id: trainId,
            owner_id: owner.id,
            position: lastWagonPosition + i
        });
    }
}