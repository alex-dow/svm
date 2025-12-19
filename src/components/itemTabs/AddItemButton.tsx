'use client';

import { Button } from "primereact/button";
import { useNameModal } from "./ItemNameModalProvider";
import { CreateAction } from "@/lib/actions/types";

export interface AddItemButtonProps {
  createAction: CreateAction;
}

export default function AddItemButton({ createAction }: AddItemButtonProps) {


  
  const nameModal = useNameModal();

  const show = () => {
    

    nameModal?.setCreateAction(() => createAction);
    nameModal?.setItemId(null);
    nameModal?.setItemName('');
    nameModal?.show();
  }

  return (
    <Button icon="pi pi-plus" outlined onClick={show}/>
    
  )
}