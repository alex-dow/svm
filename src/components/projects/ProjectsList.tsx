import ProjectListItem from "./ProjectListItem";
import { getProjects } from "@/lib/services/projects";
export default async function ProjectsList() {
    
    const projects = await getProjects();
    
    return (
        <>
        {projects.map((project) => (
            <ProjectListItem projectId={project.id} name={project.name} key={project.id}/>
        ))}
        </>
    )
}