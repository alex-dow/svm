'use client';

import { Button } from "primereact/button";
import { useState } from "react";
import NewProjectModal from "./NewProjectModal";
import ImportSaveFile from "../modals/ImportSaveFile";

export default function ProjectsPageHeader() {
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [showImportSaveFileModal, setShowImportSaveFileModal] = useState(false);
    return (
        <>
            <div className="flex justify-between items-center">
                <h1>Projects</h1>
                <div className="flex gap-2">
                    <Button icon="pi pi-plus" rounded onClick={() => setShowNewProjectModal(true)} title="Create project" size="large"  />
                    <Button icon="pi pi-file" rounded onClick={() => setShowImportSaveFileModal(true)} title="Import data from save file" size="large"/>
                </div>
            </div>
            <NewProjectModal visible={showNewProjectModal} onHide={() => setShowNewProjectModal(false)}></NewProjectModal>
            <ImportSaveFile visible={showImportSaveFileModal} onHide={() => setShowImportSaveFileModal(false)}></ImportSaveFile>
        </>
    );
}