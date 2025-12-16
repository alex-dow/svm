
import ListItem from "./ListItem";
import ItemsTabPanelHeader from "./ItemsTabPanelHeader";

export type Item = {
    id: number,
    name: string
};

export type ItemsTabPanelProps<T extends Item> = {
    newButtonLabel: string
    fetchAction: (projectId: number) => Promise<T[]>;
    submitAction: (name: string, projectId: number) => Promise<T>;
    deleteAction: (id: number, projectId: number) => Promise<void>;
    projectId: number;
}
export default async function ItemsTabPanel<T extends Item>(props: ItemsTabPanelProps<T>) {
  const { newButtonLabel, projectId, fetchAction, submitAction, deleteAction} = props;

  const items = await fetchAction(projectId);

  return (
    <div className="flex flex-col">
      <ItemsTabPanelHeader newButtonLabel={newButtonLabel} onSubmit={submitAction} projectId={projectId} />
      <ul>
        {items.map((item) => (
          <ListItem key={item.id} item={item} projectId={projectId} deleteAction={deleteAction} />
        ))}
      </ul>
    </div>    
  )
}