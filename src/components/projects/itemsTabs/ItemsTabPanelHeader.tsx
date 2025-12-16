'use client';
import ItemNameModal from "./ItemNameModal";
import { useState } from "react";
import { Button } from "primereact/button";

export type ItemsTabPanelHeaderProps = {
  newButtonLabel: string;
  onSubmit: (name: string, projectId: number) => void;
  projectId: number;
}

export default function ItemsTabPanelHeader({ newButtonLabel, onSubmit, projectId }: ItemsTabPanelHeaderProps) {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <div className="flex justify-between items-center">
        <Button label={newButtonLabel} icon="pi pi-plus" outlined data-testid="new-item-button" onClick={() => setVisible(true)} />
      </div>
      <ItemNameModal 
        visible={visible} 
        setVisible={setVisible} 
        onSubmit={onSubmit} 
        header="New item" 
        id="new-item-modal" 
        projectId={projectId} 
      />
    </>
  )
}