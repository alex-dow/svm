import ProjectListItem from "./ProjectListItem";
import { handleGetProjects } from "@/lib/actions/projects";

export default async function ProjectsList() {
    const projects = await handleGetProjects();
    
    return (
        <>
        {projects.map((project) => (
            <ProjectListItem projectId={project.id} name={project.name} key={project.id}/>
        ))}
        </>
    )
}