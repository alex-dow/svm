import DeleteProjectButton from "@/components/projects/DeleteProjectButton";
import ExportProjectButton from "@/components/projects/ExportProjectButton";
import { handleGetProject } from "@/lib/actions/projects";
import Link from "next/link";

export default async function ProjectRootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{projectId: string}>
}>) {
    const { projectId } = await params;
    const projectIdInt = parseInt(projectId);

    const project = await handleGetProject(projectIdInt);

  return (
    <>
        <div className="flex gap-4 p-1 bg-gray-800 items-center h-18" id="projects-header">
            <h1 className="text-3xl min-w-1/6">{project?.name}</h1>
            <Link href={`/projects/${projectId}/trains`}>Trains</Link>
            <Link href={`/projects/${projectId}/trucks`}>Trucks</Link>
            <Link href={`/projects/${projectId}/drones`}>Drones</Link>
            <div className="justify-self-end flex gap-2">
              <ExportProjectButton projectId={projectIdInt}/>
              <DeleteProjectButton projectId={projectIdInt}/>
              
            </div>
        </div>
        {children}
    </>
  );
}