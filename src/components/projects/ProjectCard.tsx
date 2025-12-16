'use client';
import { ProjectWithCounts } from "@/lib/db/schemas/projects";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

function ProjectCardMetadata({
  header,
  children,
  id
}: {
  header: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="flex text-sm">
      <div className="w-2/3 font-bold text-gray-400" data-test-id="header">{header}</div>
      <div className="w-1/3 text-right" data-test-id="value">{children}</div>
    </div>
  );
}

function ProjectCardHeader({ header }: { header: string }) {
  return (
    <div
      title={header}
      className="text-lg font-bold text-ellipsis overflow-clip max-w-full whitespace-nowrap"
    >
      {header}
    </div>
  );
}

export function ProjectCard({ project }: { project: ProjectWithCounts }) {

  const router = useRouter();
  const handleOpen = () => {
    router.push(`/projects/${project.id}`);
  }


  return (
    <Card
      header={<ProjectCardHeader header={project.name} />}
      className="w-64 hover:bg-gray-800 p-2 shadow-md border rounded-md border-stone-900"
      id={`project-card-${project.id}`}
    >
      <div className="flex flex-col pb-4 gap-1">
        <ProjectCardMetadata header="Trains" id={`total-trains-${project.id}`}>{project.trains}</ProjectCardMetadata>
        <ProjectCardMetadata header="Train Stations" id={`total-train-stations-${project.id}`}>{project.train_stations}</ProjectCardMetadata>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button label="Open" icon="pi pi-external-link" size="small" outlined onClick={handleOpen} data-test-id="open-project-button"/>
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
