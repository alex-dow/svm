import ProjectsList from "@/components/projects/ProjectsList";
import ProjectsPageHeader from "@/components/projects/ProjectsPageHeader";

export default async function HomePage() {
  return (
    <>
      <ProjectsPageHeader/>
      <ProjectsList />
    </>
  );
}
