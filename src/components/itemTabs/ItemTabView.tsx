import { TabView } from "primereact/tabview";

import { getTrainsAction, createTrainAction, deleteTrainAction, renameTrainAction } from "@/lib/actions/trains";

import ItemTabPanel from "./ItemTabPanel";
import { NameModalProvider } from "./ItemNameModalProvider";
import { createTrainStationAction, deleteTrainStationAction, getTrainStationsAction, renameTrainStationAction } from "@/lib/actions/trainStations";



/**
 * Wrapper to <TabView>. This is the container for all tabs.
 */
export default async function ItemTabView({ projectId }: { projectId: number }) {

  return (
    <NameModalProvider projectId={projectId}>
      <TabView id="item-tabs" className="p-0 m-0 flex-1 flex flex-col" pt={{
        panelContainer: {
          className:'p-0 m-0 flex-1 flex flex-col'
        }
      }}>
      
        <ItemTabPanel 
          itemType="train" 
          tabHeader="Trains"
          projectId={projectId}
          fetchAction={getTrainsAction} 
          renameAction={renameTrainAction} 
          deleteAction={deleteTrainAction} 
          createAction={createTrainAction}
          createModalTitle="Create new train"
        />

        <ItemTabPanel
          itemType="train_station"
          tabHeader="Train Stations"
          projectId={projectId}
          fetchAction={getTrainStationsAction}
          renameAction={renameTrainStationAction}
          deleteAction={deleteTrainStationAction}
          createAction={createTrainStationAction}
          createModalTitle="Create new train station"
        />
      </TabView>
    </NameModalProvider>
    
  );
}