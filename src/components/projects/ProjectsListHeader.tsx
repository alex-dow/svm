'use client';

import { Button } from "primereact/button";
import NewProjectModal from "./NewProjectModal";
import { useState } from "react";

export default function ProjectsListHeader() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Projects</h1>
        <Button
          label="New project"
          onClick={() => setVisible(true)}
          icon="pi pi-plus"
        />
      </div>    
      <NewProjectModal visible={visible} setVisible={setVisible} />
    </>
  );
}