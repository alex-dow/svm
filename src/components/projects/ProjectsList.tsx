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
    <div>
      <h1>Projects List</h1>
      <Button
        label="New project"
        onClick={() => setVisible(true)}
        icon="pi pi-plus"
      />
      <div className="flex gap-4 p-4">
        {projects.map((project) => (
          <ProjectCard project={project} />
        ))}
      </div>
      <NewProjectModal visible={visible} setVisible={setVisible} />
    </div>
  );
}
