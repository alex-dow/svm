'use client';

import { Button } from "primereact/button";

import { confirmDialog } from "primereact/confirmdialog";


export type ListItemProps<T extends {id: number, name: string}> = {
  deleteAction?:  (itemId: number, projectId: number) => Promise<void>;
  renameAction?: (itemId: number, projectId: number) => void;

  projectId: number;
  item: T;
}

export default function ListItem<T extends {id: number, name: string}>({ deleteAction, renameAction, projectId, item }: ListItemProps<T>) {
  const onDelete = () => {
    confirmDialog({
      message: `Are you sure you want to delete ${item.name}?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: async () => await deleteAction?.(item.id, projectId),
      reject: () => {},
    });
  }
  return (
    <li className="flex justify-between items-center p-1">
      <a href="#">{item.name}</a>
      <div className="flex items-center gap-2">
        <Button icon="pi pi-pencil" outlined className="p-1" size="small" title="Edit" onClick={() => renameAction?.(item.id, projectId)} />
        <Button icon="pi pi-trash" outlined severity="danger" className="p-1" size="small" title="Delete" onClick={onDelete} />
      </div>
    </li>
  )
}