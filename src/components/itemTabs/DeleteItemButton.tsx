'use client';

import { DeleteAction } from "@/lib/actions/types";
import { useToastContext } from "../contexts/ToastContextProvider";
import { Button } from "primereact/button";
import { confirmPopup } from "primereact/confirmpopup";

export interface DeleteItemButtonProps {
  deleteAction: DeleteAction;
  item: unknown & {id: number, name: string};
  projectId: number;
}

export default function DeleteItemButton({deleteAction, item, projectId}: DeleteItemButtonProps) {
  const showToast = useToastContext()?.showToast;

  const onDelete = async () => {
    await deleteAction(projectId, item.id);
    showToast?.({
      severity: "success",
      summary: "Deleted",
      detail: `${item.name} deleted successfully`,
    });
  }

  const confirmDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    confirmPopup({
      target: e.currentTarget,
      message: `Are you sure you want to delete ${item.name}?`,
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: onDelete,
      reject: () => {},
    })
  }
  return (
    <Button icon="pi pi-trash" outlined severity="danger" className="p-1" size="small" title="Delete" onClick={confirmDelete} />
  )
}