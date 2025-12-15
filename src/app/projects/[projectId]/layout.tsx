import { getServerSession } from "@/lib/auth/server";

export default async function ProjectLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <div>
    <p>Layout id: {projectId}</p>
    {children}
    </div>;
}