'use server';
import { cacheTag,  updateTag } from "next/cache";
import { getDatabase } from "../db";
import { UpdateTrain } from "../db/schemas/trains";

export type GetTrainsParams ={
    projectId: number;
    ownerId: string;
}
export async function getTrains({ projectId, ownerId }: GetTrainsParams) {
  "use cache";
  cacheTag("trains-" + projectId + "-" + ownerId);
  if (!ownerId) throw new Error("No owner id provided");
  
  const db = getDatabase();
  const query =db.selectFrom('train')
    .selectAll()
    .where('owner_id', '=', ownerId)
    .where('project_id', '=', projectId)
    .orderBy('name', 'asc')
    
    
  return await query.execute();
}

export interface GetTrainParams {
  id: number;
  projectId: number;
  ownerId: string;
}

export async function getTrain({ id, projectId, ownerId }: GetTrainParams) {
  const train = await getDatabase()
    .selectFrom("train")
    .selectAll()
    .where("id", "=", id)
    .where("project_id", "=", projectId)
    .where("owner_id", "=", ownerId)
    .executeTakeFirstOrThrow();
  return train;
}

export interface CreateTrainParams {
    name: string;
    ownerId: string;
    projectId: number;
  }
  
export async function createTrain({ name, ownerId, projectId }: CreateTrainParams) {
  

  const train = await getDatabase()
    .insertInto("train")
    .values({
      name,
      owner_id: ownerId,
      project_id: projectId,
      wagons: 0,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  updateTag("trains-" + projectId + "-" + ownerId);
  updateTag('projects-' + ownerId);

  return train;
}

export interface DeleteTrainParams {
  id: number;
  projectId: number;
  ownerId: string;
}

export async function deleteTrain({ id, projectId, ownerId }: DeleteTrainParams) {
  
  console.log("deleteTrain", id, projectId, ownerId);

  const result = await getDatabase()
    .deleteFrom("train")
    .where("id", "=", id)
    .where("project_id", "=", projectId)
    .where("owner_id", "=", ownerId)
    .execute();

  if (result.length === 0) {
    throw new Error("Train not found");
  }

  updateTag("trains-" + projectId + "-" + ownerId);
}

export interface UpdateTrainParams {
  id: number;
  projectId: number;
  ownerId: string;
  train: UpdateTrain;
}

export async function updateTrain({id, projectId, ownerId, train}: UpdateTrainParams) {
  const result = await getDatabase()
    .updateTable("train")
    .set(train)
    .where("id", "=", id)
    .where("project_id", "=", projectId)
    .where("owner_id", "=", ownerId)
    .executeTakeFirstOrThrow()

  
    
  updateTag("trains-" + projectId + "-" + ownerId);
  return result;
}