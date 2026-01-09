
import ItemTabView from "@/components/itemTabs/ItemTabView";
import { ConfirmDialog } from "primereact/confirmdialog";



export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;


  return (
    <div className="flex flex-1">

      <ConfirmDialog />
      <div className="w-4/12 border-r border-stone-800 flex flex-col flex-1">
        <ItemTabView projectId={parseInt(projectId)} />
      </div>
      <div className="w-8/12">
        {children}
      </div>
    </div>
  )
  
  ;
}