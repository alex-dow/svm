import { DeleteAction, FetchAction, RenameAction } from "@/lib/actions/types";
import ItemListItem from "./ItemListItem";

export interface ItemListProps {
    fetchAction: FetchAction,
    projectId: number,
    deleteAction: DeleteAction,    
    renameAction: RenameAction,
}


  

export default async function ItemList(props: ItemListProps) {
  const { fetchAction, projectId, deleteAction, renameAction } = props;
  const items = await fetchAction(projectId);

  return (
    <>
      <ul className="list-none p-0 m-0 flex flex-col">
        {items.map((item) => (
          <ItemListItem 
            key={item.id} 
            item={item} 
            projectId={projectId} 
            deleteAction={deleteAction} 
            renameAction={renameAction} 
          />
        
        ))}
      </ul>
    </>
  )
}