'use client';

import { Button } from "primereact/button";
import { useNameModal } from "./ItemNameModalProvider";
import { CreateAction } from "@/lib/actions/types";

export interface AddItemButtonProps {
  createAction: CreateAction;
  createModalTitle?: string;
  placeholder?: string;
}

export default function AddItemButton({ createAction, createModalTitle, placeholder }: AddItemButtonProps) {


  
  const nameModal = useNameModal();

  const show = () => {
    

    nameModal?.setCreateAction(() => createAction);
    nameModal?.setItemId(null);
    nameModal?.setItemName('');
    nameModal?.setTitle(createModalTitle ?? 'Create new item');
    nameModal?.setPlaceholder(placeholder ?? 'Name');
    nameModal?.show();
  }

  return (
    <Button className="flex-1 p-1 px-2" size="small" icon="pi pi-plus" outlined onClick={show} label={createModalTitle}/>
    
  )
}