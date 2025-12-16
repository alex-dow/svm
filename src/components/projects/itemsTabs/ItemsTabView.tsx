
import { TabView, TabPanel, TabPanelPassThroughOptions } from "primereact/tabview";
import Image from "next/image";
import ItemsTabPanel from "./ItemsTabPanel";
import { createTrainAction, getTrainsAction, deleteTrainAction} from "@/actions/trains";
import { Suspense } from "react";
import { ProgressSpinner } from "primereact/progressspinner";


function TabIcon({ icon, alt }: { icon: string, alt: string }) {
  return (
    <div className="w-[40px] h-[40px] p-1 bg-stone-800 rounded-md flex items-center justify-center">
      <Image src={icon} alt={alt} aria-hidden="true" width={64} height={64} />
    </div>
  )
}

const tabPanelPt: TabPanelPassThroughOptions = {
  headerAction: {
    className: 'flex items-center gap-2 py-2 px-2'
  }
}

export default async function ItemsTabView({ projectId }: { projectId: number }) {
  return (
    <TabView id="project-tabs">
      <TabPanel pt={tabPanelPt} header="Trains" leftIcon={
        <TabIcon icon="/data/items/desc-locomotive-c_64.png" alt="Trains"/>
      }>
        
        <ItemsTabPanel newButtonLabel="New train" fetchAction={getTrainsAction} submitAction={createTrainAction} deleteAction={deleteTrainAction} projectId={projectId}/>
        
      </TabPanel>

    </TabView>
  );
}