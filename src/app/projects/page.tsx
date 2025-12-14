"use server";

import ProjectsList from "@/components/projects/ProjectsList";
import { getProjectsAction } from "@/actions/projects";

export default async function ProjectsPage() {
  const projects = await getProjectsAction();

  return <ProjectsList projects={projects} />;
}
