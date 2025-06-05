import { Splitter, SplitterPanel } from "primereact/splitter";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import TrainStationsList from "@/components/trains/TrainStationsList";
import { TabPanel, TabView } from "primereact/tabview";
import TrainsList from "@/components/trains/TrainsList";
import AddTrainStationButton from "@/components/trains/AddTrainStationButton";
import AddTrainButton from "@/components/trains/AddTrainButton";

export default async function TrainsRootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{projectId: string}>
}>) {
    const { projectId } = await params;
    const projectIdInt = parseInt(projectId)

  return (
    <Splitter className="flex flex-1">
      <SplitterPanel size={25} minSize={25} className="relative">
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto">
          <Suspense fallback={(<Loading/>)}>
            <TabView>
              <TabPanel header="Stations">
                <AddTrainStationButton projectId={projectIdInt} />
                <TrainStationsList projectId={projectIdInt} />
              </TabPanel>
              <TabPanel header="Trains">
                <AddTrainButton projectId={projectIdInt} />
                <TrainsList projectId={projectIdInt} />
              </TabPanel>
            </TabView>
            
          </Suspense>
        </div>
      </SplitterPanel>
      <SplitterPanel size={75} className="flex flex-col">
        { children }
      </SplitterPanel>
    </Splitter>
  );
}