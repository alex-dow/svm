/**
 * Plain functions for interacting with the database.
 *
 * TODO: What is caching here? Can't we separate this into a separate layer
 * to keep the database layer pure?
 */
"use server";
import { getDatabase } from "@/lib/db";
import { cacheTag, revalidateTag, updateTag } from "next/cache";


export interface GetProjectsParams {
  ownerId: string;
}

export async function getProjects({ ownerId }: GetProjectsParams) {
  "use cache";
  cacheTag("projects-" + ownerId);
  if (!ownerId) throw new Error("No owner id provided");



  const db = getDatabase();
  const query =db.selectFrom('project')
    .leftJoin('train_station', 'project.id', 'train_station.project_id')
    .leftJoin('train', 'project.id', 'train.project_id')
    .select('project.id as id')
    .select('project.name as name')
    .select('project.owner_id as owner_id')
    .select(({fn}) => fn.count<number>('train_station.id').as('train_stations'))
    .select(({fn}) => fn.count<number>('train.id').as('trains'))
    .where('project.owner_id', '=', ownerId)
    .groupBy('project.id');
  
  return await query.execute();
}

export interface GetProjectParams {
  ownerId: string;
  projectId: number;
}

export async function getProject({ ownerId, projectId }: GetProjectParams) {
  'use cache';
  cacheTag("project-" + ownerId + "-" + projectId);
  return getDatabase()
    .selectFrom("project")
    .selectAll()
    .where("owner_id", "=", ownerId)
    .where("id", "=", projectId)
    .executeTakeFirstOrThrow();
}

export interface RenameProjectParams {
  projectId: number;
  ownerId: string;
  name: string;
}

export async function renameProject({
  projectId,
  ownerId,
  name,
}: RenameProjectParams) {
  revalidateTag("projects-" + ownerId, 'max');
  if (!projectId || !ownerId || !name) {
    throw new Error("Project id, owner id and name are required");
  }
  return getDatabase()
    .updateTable("project")
    .set({ name })
    .where("id", "=", projectId)
    .where("owner_id", "=", ownerId)
    .executeTakeFirstOrThrow();
}

export interface CreateProjectParams {
  name: string;
  ownerId: string;
}

export async function createProject({ name, ownerId }: CreateProjectParams) {
  revalidateTag("projects-" + ownerId, 'max');
  if (!name || !ownerId) {
    throw new Error("Name and ownerId are required");
  }
  return getDatabase()
    .insertInto("project")
    .values({
      name,
      owner_id: ownerId,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export interface DeleteProjectParams {
  ownerId: string;
  projectId: number;
}

export async function deleteProject({
  ownerId,
  projectId,
}: DeleteProjectParams) {
  updateTag("projects-" + ownerId);
  updateTag('project-' + ownerId + '-' + projectId);
  if (!ownerId || !projectId) {
    throw new Error("Owner id and project id are required");
  }

  return getDatabase()
    .deleteFrom("project")
    .where("id", "=", projectId)
    .where("owner_id", "=", ownerId)
    .executeTakeFirstOrThrow();
}
