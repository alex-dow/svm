"use server";

import { getServerSession } from "@/lib/auth/server";
import { createProject, getProjects } from "@/lib/services/projects";
import { cacheTag } from "next/cache";

export async function createProjectAction(name: string) {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const ownerId = session.user.id;
  const project = await createProject({ name, ownerId });
  return project;
}

export async function getProjectsAction() {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const ownerId = session.user.id;
  const projects = await getProjects(ownerId);
  return projects;
}
