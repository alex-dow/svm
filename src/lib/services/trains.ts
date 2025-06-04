import { getDatabase } from "@/server/db";
import { getCurrentUser } from "./auth";
import { Train } from "@/server/db/schemas/trains";
import { unstable_cache } from "next/cache";

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

export async function createTrain(projectId: number, name: string, ownerId: string) {
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

