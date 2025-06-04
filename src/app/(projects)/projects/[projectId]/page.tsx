import { handleGetProject } from "@/lib/actions/projects";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

export interface ProjectHomePageParams {
    projectId: string
}

export interface ProjectHomePageProps {
    params: Promise<ProjectHomePageParams>
}

export default async function ProjectHomePage({params}: ProjectHomePageProps) {
    const session = await auth.api.getSession({headers: await headers()});
    if (!session) { redirect('/login') }

    const { projectId } = await params;
    const project = await handleGetProject(parseInt(projectId));
    if (!project) {
        notFound();
    }

    return (
        <p>Welcome to project #{projectId} - {project.name}</p>
    )

}