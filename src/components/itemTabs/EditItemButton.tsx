'use client';

import { Button } from "primereact/button";
import { useNameModal } from "./ItemNameModalProvider";
import { RenameAction } from "@/lib/actions/types";

export interface EditItemButtonProps {
  renameAction: RenameAction;
  item: unknown & {id: number, name: string};
}

export default function EditItemButton({ renameAction, item }: EditItemButtonProps) {
  
  const nameModal = useNameModal();

  const show = () => {
    

    nameModal?.setRenameAction(() => renameAction);
    nameModal?.setItemId(item.id);
    nameModal?.setItemName(item.name);
    nameModal?.show();
  }

  return (
    <Button icon="pi pi-pencil" outlined onClick={show}/>
    
  )
}