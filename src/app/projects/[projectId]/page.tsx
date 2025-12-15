import { getProjectAction } from "@/actions/projects";
import { getServerSession } from "@/lib/auth/server";
import { getProject } from "@/lib/services/projects";

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
        const { projectId } = await params;
        const project = await getProjectAction(parseInt(projectId));


  return <div>
    <h1>{project.name}</h1>
    <p>PagE: project id: { project.id }</p>
  </div>
}