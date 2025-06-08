import { Splitter, SplitterPanel } from "primereact/splitter";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import TrainStationsList from "@/components/trains/TrainStationsList";
import { TabPanel, TabView } from "primereact/tabview";
import TrainsList from "@/components/trains/TrainsList";
import AddTrainStationButton from "@/components/trains/AddTrainStationButton";
import AddTrainButton from "@/components/trains/AddTrainButton";
import { headers } from "next/headers";

export default async function TrainsRootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode,
  params: Promise<{projectId: string}>
}>) {
  const h = await headers();
  const p = await params;
  const projectId = parseInt(p.projectId);
  const isTrain = (h.get('x-path')?.includes('/trains/train') ?? false);

  
  const initialTab = isTrain ? 1 : 0;

  return (
    <Splitter className="flex flex-1">
      <SplitterPanel size={25} minSize={25} className="relative">
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto">
          <Suspense fallback={(<Loading/>)}>
            <TabView activeIndex={initialTab}>
              <TabPanel header="Stations">
                <AddTrainStationButton projectId={projectId} />
                <TrainStationsList projectId={projectId} />
              </TabPanel>
              <TabPanel header="Trains">
                <AddTrainButton projectId={projectId} />
                <TrainsList projectId={projectId} />
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