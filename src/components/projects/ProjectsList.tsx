import { ProjectWithCounts } from "@/lib/db/schemas/projects";

import { ProjectCard } from "./ProjectCard";
import ProjectsListHeader from "./ProjectsListHeader";

export interface ProjectsListProps {
  projects: ProjectWithCounts[];
}

export default function ProjectsList(props: ProjectsListProps) {
  const { projects } = props;

  return (
    <div className="flex flex-col flex-1 p-4">
      <ProjectsListHeader />
      <div className="flex gap-4">
        {projects.map((project) => (
          <ProjectCard project={project} key={project.id}/>
        ))}
      </div>
      
    </div>
  );
}
