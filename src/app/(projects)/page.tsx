import Loading from "@/components/Loading";
import ProjectsList from "@/components/projects/ProjectsList";
import ProjectsPageHeader from "@/components/projects/ProjectsPageHeader";
import { handleGetProjects } from "@/lib/actions/projects";
import { Suspense } from "react";

export default async function HomePage() {

  const projects = await handleGetProjects();

  return (
    <Suspense fallback={(<Loading/>)}>
      <ProjectsPageHeader/>
      <ProjectsList projects={projects}/>
    </Suspense>
  );
}
