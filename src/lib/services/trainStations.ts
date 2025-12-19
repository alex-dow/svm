import { cacheTag, updateTag } from "next/cache";
import { getDatabase } from "../db";
import { UpdateTrainStation } from "../db/schemas/trainStations";

export type GetTrainStationsParams ={
  projectId: number;
  ownerId: string;
}

export async function getTrainStations({ projectId, ownerId }: GetTrainStationsParams) {
  "use cache";
  cacheTag("train-stations-" + projectId + "-" + ownerId);
  if (!ownerId) throw new Error("No owner id provided");
  
  const db = getDatabase();
  const query =db.selectFrom('train_station')
    .selectAll()
    .where('owner_id', '=', ownerId)
    .where('project_id', '=', projectId);
    
  return await query.execute();
}

export interface CreateTrainStationParams {
  name: string;
  projectId: number;
  ownerId: string;
}

export async function createTrainStation({ name, projectId, ownerId }: CreateTrainStationParams) {
  const db = getDatabase();
  const trainStation = await db
    .insertInto('train_station')
    .values({ name, project_id: projectId, owner_id: ownerId })
    .returningAll()
    .executeTakeFirstOrThrow();
  updateTag("train-stations-" + projectId + "-" + ownerId);
  updateTag('projects-' + ownerId);
  return trainStation;
}

export interface DeleteTrainStationParams {
  id: number;
  projectId: number;
  ownerId: string;
}

export async function deleteTrainStation({ id, projectId, ownerId }: DeleteTrainStationParams) {
  const db = getDatabase();
  await db
    .deleteFrom('train_station')
    .where('id', '=', id)
    .where('project_id', '=', projectId)
    .where('owner_id', '=', ownerId)
    .executeTakeFirstOrThrow();
  updateTag("train-stations-" + projectId + "-" + ownerId);
  updateTag('projects-' + ownerId);
}

export interface UpdateTrainStationParams {
    id: number;
    projectId: number;
    ownerId: string;
    trainStation: UpdateTrainStation;
  }
  
export async function updateTrainStation({id, projectId, ownerId, trainStation}: UpdateTrainStationParams) {
  const result = await getDatabase()
    .updateTable("train_station")
    .set(trainStation)
    .where("id", "=", id)
    .where("project_id", "=", projectId)
    .where("owner_id", "=", ownerId)
    .executeTakeFirstOrThrow()
  
    
      
  updateTag("train-stations-" + projectId + "-" + ownerId);
  return result;
}

export interface GetTrainStationParams {
    id: number;
    projectId: number;
    ownerId: string;
}

export async function getTrainStation({ id, projectId, ownerId }: GetTrainStationParams) {
  const db = getDatabase();
  const query = db.selectFrom('train_station')
    .selectAll()
    .where('id', '=', id)
    .where('project_id', '=', projectId)
    .where('owner_id', '=', ownerId)
    .executeTakeFirstOrThrow();
  return query;
}