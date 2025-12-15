"use client";

import { Project } from "@/lib/db/schemas/projects";
import NewProjectModal from "./NewProjectModal";
import { useState } from "react";
import { Button } from "primereact/button";
import { ProjectCard } from "./ProjectCard";

export interface ProjectsListProps {
  projects: Project[];
}

export default function ProjectsList(props: ProjectsListProps) {
  const { projects } = props;
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col flex-1 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Projects</h1>
        <Button
          label="New project"
          onClick={() => setVisible(true)}
          icon="pi pi-plus"
        />
      </div>
      <div className="flex gap-4">
        {projects.map((project) => (
          <ProjectCard project={project} key={project.id}/>
        ))}
      </div>
      <NewProjectModal visible={visible} setVisible={setVisible} />
    </div>
  );
}
