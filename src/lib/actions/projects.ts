'use server';

import { revalidateTag } from "next/cache";
import { getCurrentUser } from "../services/auth";
import { createProject, deleteProject, exportProject, getCachedProject, getCachedProjects, getProject, importSaveFileProject, updateProject } from "../services/projects";
import { Project } from "@/server/db/schemas/projects";
import { ImportTrain, ImportTrainStation } from "../types/satisfactory/importSaveTypes";

export async function handleGetProjects() {
    const user = await getCurrentUser();
    return getCachedProjects(user.id);
}

export async function handleGetProject(projectId: number) {
    const user = await getCurrentUser();
    return getCachedProject(projectId, user.id);
}

export async function handleDeleteProject(projectId: number) {
    const user = await getCurrentUser();
    const project = getProject(projectId, user.id);
    if (!project) {
        // TODO: not sure if this s
        throw new Error('Project not found');
    }
    await deleteProject(projectId, user.id);
    revalidateTag(`projects:${user.id}`);
}

export async function handleCreateProject(projectName: string) {
    const user = await getCurrentUser();
    const project = createProject(projectName, user.id);
    revalidateTag(`projects:${user.id}`);
    return project;
}

export async function handleRenameProject(projectName: string, projectId: number) {
    const user = await getCurrentUser();
    const project = await getProject(projectId, user.id);
    if (!project) {
        throw new Error('Project not found');
    }
    const newProject = await updateProject({...project, name: projectName});
    revalidateTag(`projects:${user.id}`);
    revalidateTag(`project:${newProject?.id}`);
    return newProject as Project;
    
}

export async function handleExportProject(projectId: number) {
    const user = await getCurrentUser();
    const project = exportProject(projectId, user.id);
    return project;
}

export interface HandleImportSaveFileProjectParameters {
    projectName: string,
    saveFileTrainStations: ImportTrainStation[],
    saveFileTrains: ImportTrain[],
}

export async function handleImportSaveFileProject({projectName, saveFileTrainStations, saveFileTrains}: HandleImportSaveFileProjectParameters) {
    const user = await getCurrentUser();
    const projectId = await importSaveFileProject({
        projectName,
        ownerId: user.id,
        saveFileTrains,
        saveFileTrainStations
    });
    revalidateTag(`projects:${user.id}`)

    return projectId;
}