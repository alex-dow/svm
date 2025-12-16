
import { TabView, TabPanel, TabPanelPassThroughOptions } from "primereact/tabview";
import TrainsTab from "@/components/projects/itemsTabs/TrainsTab";
import TrainStationsTab from "@/components/projects/itemsTabs/TrainStationsTab";
import Image from "next/image";


function TabIcon({ icon, alt }: { icon: string, alt: string }) {
  return (
    <div className="w-[32px] h-[32px] p-0.5 bg-amber-700 rounded-md flex items-center justify-center">
      <Image src={icon} alt={alt} aria-hidden="true" width={32} height={32} />
    </div>
  )
}

const tabPanelPt: TabPanelPassThroughOptions = {
  headerAction: {
    className: 'flex items-center gap-2 py-2 px-2'
  }
}

export default function ItemsTabView() {
  return (
    <TabView id="project-tabs">
      <TabPanel pt={tabPanelPt} header="Trains" leftIcon={
        <TabIcon icon="/data/items/desc-locomotive-c_64.png" alt="Trains"/>
      }>
        <TrainsTab />
      </TabPanel>
      <TabPanel pt={tabPanelPt} header="Train stations" leftIcon={
        <TabIcon icon="/data/items/desc-trainstation-c_64.png" alt="Train stations"/>
      }>
        <TrainStationsTab />
      </TabPanel>
    </TabView>
  );
}