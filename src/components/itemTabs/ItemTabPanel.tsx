import { TabPanel } from "primereact/tabview";
import { Suspense } from "react";
import ItemList from "./ItemList";
import { ProgressSpinner } from "primereact/progressspinner";
import AddItemButton from "./AddItemButton";
import { CreateAction, DeleteAction, FetchAction, RenameAction } from "@/lib/actions/types";

export type ItemTabPanelProps = {
    itemType: 'train' | 'train_station',
    tabHeader: string,
    editPlaceholder?: string,
    fetchAction: FetchAction,
    renameAction: RenameAction,
    deleteAction: DeleteAction,
    createAction: CreateAction,
    confirmDeleteMessage?: string,
    newButtonLabel?: string,
    projectId: number,

}


export default async function ItemTabPanel(props: ItemTabPanelProps) {

  const { fetchAction, tabHeader, projectId, deleteAction, createAction, renameAction } = props;
  
    
  return (
    <TabPanel header={tabHeader}>
      <AddItemButton createAction={createAction} />
      <Suspense fallback={<ProgressSpinner />}>
        <ItemList fetchAction={fetchAction} projectId={projectId} deleteAction={deleteAction} renameAction={renameAction} />
      </Suspense>
    </TabPanel>
  )
}