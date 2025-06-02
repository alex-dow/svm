'use server';

import { getDatabase } from "@/server/db";
import { getCurrentUser } from "./auth";

export async function createProject(projectName: string) {
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }
    
    const db = getDatabase();

    const project = await db.insertInto('project').values({
        name: projectName,
        owner_id: owner.id
    }).returningAll().executeTakeFirst();

    return project;
}

export async function getProjects() {
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }

    const db = getDatabase();

    const projects = await db
        .selectFrom('project')
        .select('id')
        .select('name')
        .where('owner_id', '=', owner.id)
        .execute();

    return projects;
}

export async function deleteProject(projectId: number) {
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }

    const db = getDatabase();

    const project = await db.selectFrom('project').select('owner_id').where('id','=',projectId).executeTakeFirst();
    if (!project) { throw new Error('Project not found'); }
    if (project.owner_id !== owner.id) { throw new Error('Unauthorized'); }

    await db.deleteFrom('project').where('id', '=', projectId).execute();
}

export async function getProject(projectId: number) {
    const owner = await getCurrentUser();
    if (!owner) { throw new Error('Unauthorized'); }

    const db = getDatabase();

    const project = await db.selectFrom('project').selectAll().where('id','=',projectId).executeTakeFirst();
    if (!project) { throw new Error('Project not found'); }
    if (project.owner_id !== owner.id) { throw new Error('Unauthorized'); }

    return project;
}