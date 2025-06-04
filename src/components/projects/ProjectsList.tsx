import { Project } from "@/server/db/schemas/projects";
import ProjectListItem from "./ProjectListItem";

export default async function ProjectsList({projects}: {projects: Project[]}) {
   
    return (
        <>
        {projects.map((project) => (
            <ProjectListItem projectId={project.id} name={project.name} key={project.id}/>
        ))}
        </>
    )
}