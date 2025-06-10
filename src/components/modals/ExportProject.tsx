'use client';
import { handleExportProject } from "@/lib/actions/projects";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import Loading from "../Loading";
import { Message } from "primereact/message";

export interface ExportProjectProps {
    visible: boolean,
    onHide: () => void,
    header?: React.ReactNode | string,
    projectId: number
}
export default function ExportProject({visible, onHide, projectId}: ExportProjectProps) {

    const [ error, setError ] = useState(false);
    const [ working, setWorking ] = useState(false);



    const onClick = async (e: React.MouseEvent) => {
        setWorking(true);
        setError(false);
        try {
            e.preventDefault();

            const project = await handleExportProject(projectId);
            
            const el = document.getElementById('project-export-download-link');
            el?.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project,null,4)));
            el?.setAttribute('download','SVM Export - ' + project.projectName + '.json');
            el?.click();
            onHide();
        } catch (err) {
            setError(true);
            console.error(err);
        }
        setWorking(false);
        

    }

    return (
        <Dialog visible={visible} onHide={onHide} header="Export project">
            <a id="project-export-download-link" className="hidden"/>
            {working && <Loading />}
            {error && <Message severity="error">Failed to export project.</Message>}
            {!working && <Button onClick={onClick}>Export Project</Button>}
        </Dialog>
    )
}