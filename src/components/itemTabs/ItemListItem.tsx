import { DeleteAction, RenameAction } from "@/lib/actions/types";
import EditItemButton from "./EditItemButton";
import DeleteItemButton from "./DeleteItemButton";

export interface ItemListItemProps {
    item: unknown &{
        id: number,
        name: string,
    },
    projectId: number

    deleteAction: DeleteAction;
    renameAction: RenameAction;
}
export default async function ItemListItem(props: ItemListItemProps) {
  const { item, projectId, deleteAction, renameAction } = props;

  return (
    <li className="flex items-center justify-between hover:bg-orange-950/25 p-1">
      
      <a href="#" className="flex-1">{item.name}</a>
      <div className="flex items-center gap-2">
        <EditItemButton renameAction={renameAction} item={item} />
        <DeleteItemButton deleteAction={deleteAction} item={item} projectId={projectId} />
      </div>

    </li>
  )
}