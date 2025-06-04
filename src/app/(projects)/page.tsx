import Loading from "@/components/Loading";
import ProjectsList from "@/components/projects/ProjectsList";
import ProjectsPageHeader from "@/components/projects/ProjectsPageHeader";
import { Suspense } from "react";

export default async function HomePage() {
  return (
    <Suspense fallback={(<Loading/>)}>
      <ProjectsPageHeader/>
      <ProjectsList />
    </Suspense>
  );
}
