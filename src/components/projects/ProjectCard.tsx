import { Project } from "@/lib/db/schemas/projects";
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
      <div className="w-2/3 font-bold text-gray-400">{header}</div>
      <div className="w-1/3 text-right">{children}</div>
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

export function ProjectCard({ project }: { project: Project }) {

  const router = useRouter();
  const handleOpen = () => {
    router.push(`/projects/${project.id}`);
  }


  return (
    <Card
      header={<ProjectCardHeader header={project.name} />}
      className="w-64 hover:bg-gray-800 p-2 shadow-md border rounded-md border-stone-900"
    >
      <div className="flex flex-col pb-2">
        <ProjectCardMetadata header="Trains" id="total-trains">0</ProjectCardMetadata>
        <ProjectCardMetadata header="Train Stations" id="total-train-stations">0</ProjectCardMetadata>
        <ProjectCardMetadata header="Trucks" id="total-trucks">0</ProjectCardMetadata>
        <ProjectCardMetadata header="Drones" id="total-drones">0</ProjectCardMetadata>
        <ProjectCardMetadata header="Last updated" id="last-accessed">
          Jan 1, 2025
        </ProjectCardMetadata>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button label="Open" icon="pi pi-external-link" size="small" outlined onClick={handleOpen} />
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
