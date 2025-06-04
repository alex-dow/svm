'use client';
import { Button } from "primereact/button";
import ExportProject from "../modals/ExportProject";
import { useState } from "react";

export default function ExportProjectButton({projectId}: {projectId: number}) {

    const [ showDialog, setShowDialog ] = useState(false);

    return (
        <>
        <Button icon="pi pi-file" rounded outlined severity="info" title="Export project" onClick={(e) => {
            e.preventDefault();
            setShowDialog(true);
        }}/>
        <ExportProject visible={showDialog} onHide={() => setShowDialog(false)} projectId={projectId} />
        </>
    )

}