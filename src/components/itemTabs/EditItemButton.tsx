'use client';

import { Button } from "primereact/button";
import { useNameModal } from "./ItemNameModalProvider";
import { RenameAction } from "@/lib/actions/types";

export interface EditItemButtonProps {
  renameAction: RenameAction;
  item: unknown & {id: number, name: string};
  placeholder?: string;
}

export default function EditItemButton({ renameAction, item, placeholder }: EditItemButtonProps) {
  
  const nameModal = useNameModal();

  const show = () => {
    

    nameModal?.setRenameAction(() => renameAction);
    nameModal?.setItemId(item.id);
    nameModal?.setItemName(item.name);
    nameModal?.setTitle('Rename ' + item.name);
    nameModal?.setPlaceholder(placeholder ?? 'Name');
    nameModal?.show();
  }

  return (
    <Button icon="pi pi-pencil" outlined onClick={show} size="small" className="p-1" title="Edit" />
    
  )
}