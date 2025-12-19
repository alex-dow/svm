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
    <li>
      <div className="p-inputgroup flex-1">
        <a href="#">{item.name}</a>
        <EditItemButton renameAction={renameAction} item={item} />
        <DeleteItemButton deleteAction={deleteAction} item={item} projectId={projectId} />
      </div>
    </li>
  )
}