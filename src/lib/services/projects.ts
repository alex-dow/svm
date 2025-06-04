import { getDatabase } from "@/server/db";
import { unstable_cache } from "next/cache";
import { getTrainStations } from "./stations";
import { TrainStationPlatform, TrainStationPlatformItem } from "@/server/db/schemas/trainStations";
import { Project, UpdateProject } from "@/server/db/schemas/projects";

export async function createProject(projectName: string, ownerId: string) {
    const db = getDatabase();

    const project = await db.insertInto('project').values({
        name: projectName,
        owner_id: ownerId
    }).returningAll().executeTakeFirst();

    return project;
}


export async function getProjects(ownerId: string) {
    return getDatabase()
        .selectFrom('project')
        .select('id')
        .select('name')
        .where('owner_id', '=', ownerId)
        .execute();
}

export const getCachedProjects = (ownerId: string) => unstable_cache(
    async (ownerId: string) => getProjects(ownerId),
    ['projects'],
    { 
        tags: [`projects:${ownerId}`]
    }
)(ownerId);


export async function deleteProject(projectId: number, ownerId: string) {
    const db = getDatabase();
    await db
        .deleteFrom('project')
        .where('id', '=', projectId)
        .where('owner_id', '=', ownerId)
        .execute();
}

export async function getProject(projectId: number, ownerId: string) {
    return getDatabase()
        .selectFrom('project')
        .selectAll()
        .where('id','=',projectId)
        .where('owner_id','=',ownerId)
        .executeTakeFirst();
}

export const getCachedProject = (projectId: number, ownerId: string) => unstable_cache(
    async (projectId, ownerId) => getProject(projectId, ownerId),
    ['project'],
    {
        tags: ['project',`project:${projectId}`,`project:${projectId}:${ownerId}`]
    }
)(projectId, ownerId);


export async function updateProject(project: Project) {
    await getDatabase()
    .updateTable('project')
    .set({
        name: project.name,
        owner_id: project.owner_id
    })
    .where('id','=',project.id)
    .execute();

    return getProject(project.id, project.owner_id);
}


export const exportProject = async (projectId: number, ownerId: string) => {

    const db = getDatabase();

    const [project, trainStations] = await Promise.all([
        getProject(projectId, ownerId),
        getTrainStations(projectId, ownerId),
    ])

    if (!project) {
        console.error('no project found!');
        throw new Error('Invalid project');
    }

    let platforms: TrainStationPlatform[] = [];
    let platformItems: TrainStationPlatformItem[] = [];

    if (trainStations.length > 0) {
    
        platforms = await db.selectFrom('train_station_platform').selectAll()
        .where('owner_id','=',ownerId)
        .where('train_station_id','in',trainStations.map((ts) => ts.id))
        .execute();

    }


    if (platforms.length > 0) {

        platformItems = await db.selectFrom('train_station_platform_item').selectAll()
        .where('owner_id','=',ownerId)
        .where('platform_id','in',platforms.map((p) => p.id))
        .execute();
    }

    return {
        project,
        trainStations,
        platforms,
        platformItems
    };
}