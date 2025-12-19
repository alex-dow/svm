'use client';
import { CreateAction, RenameAction } from "@/lib/actions/types";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

const NameModalContext = createContext<{
    show: () => void;
    hide: () => void;
    setItemId: (itemId: number | null) => void;
    setItemName: (itemName: string) => void;
    setCreateAction: Dispatch<SetStateAction<CreateAction | null>>
    setRenameAction: Dispatch<SetStateAction<RenameAction | null>>
      } | null>(null);


export interface NameModalProviderProps {
    children: React.ReactNode;
    projectId: number;

}
export function NameModalProvider({ projectId, children }: NameModalProviderProps) {
  const [visible, setVisible] = useState(false);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  const [ itemId, setItemId ] = useState<number | null>(null);
  const [ itemName, setItemName ] = useState<string>('');
  const [ createAction, setCreateAction ] = useState<CreateAction | null>(null);
  const [ renameAction, setRenameAction ] = useState<RenameAction | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const itemName = formData.get("item-name") as string;

    if (itemId) {
      if (!renameAction) {
        console.warn('No rename action provided');
      } else {
        await renameAction(projectId, itemId, itemName);
      }
      hide();
    } else {
      if (!createAction) {
        console.warn('No create action provided');
      } else {
        await createAction(projectId, itemName);
      }
      hide();
    }
  }


  return (
    <NameModalContext.Provider value={{ show, hide, setItemId, setItemName, setCreateAction, setRenameAction }}>
      <Dialog visible={visible} onHide={hide}>
        <div>Creating a thing for project #{projectId}</div>
        <form onSubmit={onSubmit}>
          <InputText name="item-name" id={projectId + '-item-name-input'} defaultValue={itemName}/>
          <Button label="Save" type="submit" />
        </form>
        { itemId && itemName && <div>Item ID: {itemId}, Item Name: {itemName}</div>}
      </Dialog>   
      {children}
    </NameModalContext.Provider>
  )
}

export function useNameModal() {
  return useContext(NameModalContext);
}