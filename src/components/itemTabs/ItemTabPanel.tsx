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
    createModalTitle?: string,
    placeholder?: string

}


export default async function ItemTabPanel(props: ItemTabPanelProps) {

  const { fetchAction, tabHeader, projectId, deleteAction, createAction, renameAction, createModalTitle, placeholder } = props;
  
    
  return (
    <TabPanel header={tabHeader} className="p-0 pt-2 m-0 flex flex-col flex-1">
      <div className="p-1 flex">
        <AddItemButton createAction={createAction} createModalTitle={createModalTitle} placeholder={placeholder} />
      </div>      
      <div className="flex-1">
        <Suspense fallback={<ProgressSpinner />}>
          <ItemList fetchAction={fetchAction} projectId={projectId} deleteAction={deleteAction} renameAction={renameAction} />
        </Suspense>
      </div>
      
    </TabPanel>
  )
}