
import ItemsTabView from "@/components/projects/itemsTabs/ItemsTabView";


export default async function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  

  return (
    <div className="flex flex-1">
      <div className="w-4/12 border-r border-stone-800">
        <ItemsTabView />
      </div>
      <div className="w-8/12">
        {children}
      </div>
    </div>
  )
  
  ;
}