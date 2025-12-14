import { Project } from "@/lib/db/schemas/projects";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

export function ProjectCardMetadata({
  header,
  children,
}: {
  header: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex text-sm">
      <div className="w-2/3 font-bold text-gray-400">{header}</div>
      <div className="w-1/3 text-right">{children}</div>
    </div>
  );
}

export function ProjectCardHeader({ header }: { header: string }) {
  return (
    <div
      title={header}
      className="text-lg font-bold text-ellipsis overflow-clip max-w-full whitespace-nowrap"
    >
      {header}
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card
      header={<ProjectCardHeader header={project.name} />}
      className="w-64 hover:bg-gray-800"
    >
      <div className="flex flex-col pb-2">
        <ProjectCardMetadata header="Trains">10</ProjectCardMetadata>
        <ProjectCardMetadata header="Train Stations">20</ProjectCardMetadata>
        <ProjectCardMetadata header="Trucks">0</ProjectCardMetadata>
        <ProjectCardMetadata header="Drones">10</ProjectCardMetadata>
        <ProjectCardMetadata header="Last updated">
          Jan 1, 2025
        </ProjectCardMetadata>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button label="Open" icon="pi pi-external-link" size="small" outlined />
        <Button
          label="Delete"
          icon="pi pi-trash"
          size="small"
          outlined
          severity="danger"
        />
      </div>
    </Card>
  );
}
