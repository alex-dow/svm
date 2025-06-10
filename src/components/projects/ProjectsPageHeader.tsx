'use client';

import { Button } from "primereact/button";
import { useState } from "react";
import NewProjectModal from "./NewProjectModal";
import ImportSaveFile from "../modals/ImportSaveFile";
import ImportProjectModal from "../modals/ImportProjectModal";

export default function ProjectsPageHeader() {
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [showImportSaveFileModal, setShowImportSaveFileModal] = useState(false);
    const [showImportProjectModal, setShowImportProjectModal] = useState(false);
    return (
        <>
            <div className="flex justify-between items-center">
                <h1>Projects</h1>
                <div className="flex gap-2">
                    <Button icon="pi pi-plus" rounded onClick={() => setShowNewProjectModal(true)} title="Create project" size="large"  />
                    <Button icon="pi pi-file" rounded onClick={() => setShowImportProjectModal(true)} title="Import project" size="large" severity="help" />
                    <Button icon="pi pi-file" rounded onClick={() => setShowImportSaveFileModal(true)} title="Import data from save file" size="large"/>
                </div>
            </div>
            <NewProjectModal visible={showNewProjectModal} onHide={() => setShowNewProjectModal(false)}></NewProjectModal>
            <ImportSaveFile visible={showImportSaveFileModal} onHide={() => setShowImportSaveFileModal(false)}></ImportSaveFile>
            <ImportProjectModal visible={showImportProjectModal} onHide={() => setShowImportProjectModal(false)}></ImportProjectModal>
        </>
    );
}