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
    <ul>
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
  )
}