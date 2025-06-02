'use server';

import { getDatabase } from "@/server/db";
import { getCurrentUser } from "./auth";
import { TrainConsist } from "@/server/db/schemas/trains";

export async function getTrainConsists(projectId: number): Promise<TrainConsist[]> {
    const db = getDatabase();
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }

    const res = await db.selectFrom('train_consist')
        .selectAll()
        .where('project_id','=',projectId)
        .where('owner_id','=',owner.id)
        .execute();
    return res;
}

export async function createTrainConsist(name: string, projectId: number): Promise<TrainConsist | undefined> {
    const db = getDatabase();
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }

    const res = db.insertInto('train_consist').values({
        name,
        project_id: projectId,
        owner_id: owner.id
    })
    .returningAll()
    .executeTakeFirst();
    return res;
}

export async function createTrainConsists(names: string[], projectId: number): Promise<TrainConsist[]> {

    const db = getDatabase();
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }

    const res = db.insertInto('train_consist').values(
        names.map((name) => ({
            name,
            owner_id: owner.id,
            project_id: projectId
        }))
    ).returningAll().execute();
    return res;
}

export async function deleteTrainConsist(consistId: number) {
    const db = getDatabase();
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }

    const consist = await db.selectFrom('train_consist').select('owner_id').where('id','=',consistId).executeTakeFirst();
    if (!consist) {
        throw new Error('Unknown train consist');
    }

    if (consist.owner_id != owner.id) {
        throw new Error('Forbidden');
    }

    await db.deleteFrom('train_consist').where('id','=',consistId).execute();
}