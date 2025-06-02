import { getProject } from "@/lib/services/projects";
import { notFound } from "next/navigation";

export interface ProjectHomePageParams {
    projectId: string
}

export interface ProjectHomePageProps {
    params: Promise<ProjectHomePageParams>
}

export default async function ProjectHomePage({params}: ProjectHomePageProps) {
    const { projectId } = await params;
    const project = await getProject(parseInt(projectId));
    if (!project) {
        notFound();
    }

    return (
        <p>Welcome to project #{projectId} - {project.name}</p>
    )

}