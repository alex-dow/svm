import { Suspense } from "react";
import Loading from "@/components/Loading";
import TrainStationsList from "@/components/trains/TrainStationsList";
import { TabPanel, TabView } from "primereact/tabview";
import TrainsList from "@/components/trains/TrainsList";
import AddTrainStationButton from "@/components/trains/AddTrainStationButton";
import AddTrainButton from "@/components/trains/AddTrainButton";
import { headers } from "next/headers";
import NetworkOverview from "@/components/trains/NetworkOverview";

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
    <div className="flex flex-1 gap-2">
      <div className="relative w-1/4">
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto">
          <Suspense fallback={(<Loading/>)}>
            <TabView activeIndex={initialTab} pt={{
              panelContainer: {
                className: 'p-1'
              },
              
            }}>
              <TabPanel header="Stations" pt={{
                headerAction: {
                  className: 'p-2'
                }
              }}>
                <AddTrainStationButton projectId={projectId} />
                <TrainStationsList projectId={projectId} />
              </TabPanel>
              <TabPanel header="Trains" pt={{
                headerAction: {
                  className: 'p-2'
                }
              }}>
                <AddTrainButton projectId={projectId} />
                <TrainsList projectId={projectId} />
              </TabPanel>
            </TabView>           
          </Suspense>
        </div>
      </div>
      <div className="relative w-1/2">
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto flex flex-col">

          { children }
        </div>
      </div>
      <div className="relative w-1/4">
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto flex flex-col">
          <NetworkOverview projectId={projectId} />
        </div>
      </div>
    </div>
  );

}