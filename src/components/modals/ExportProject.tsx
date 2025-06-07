'use client';
import { handleExportProject } from "@/lib/actions/projects";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

export interface ExportProjectProps {
    visible: boolean,
    onHide: () => void,
    header?: React.ReactNode | string,
    projectId: number
}
export default function ExportProject({visible, onHide, projectId}: ExportProjectProps) {
    const onClick = async (e: React.MouseEvent) => {
        e.preventDefault();

        const project = await handleExportProject(projectId);

        const el = document.getElementById('project-export-download-link');
        el?.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project,null,4)));
        el?.setAttribute('download','SVM - ' + project.projectName);
        el?.click();

    }

    return (
        <Dialog visible={visible} onHide={onHide}>
            <a id="project-export-download-link" className="hidden"/>
            <Button onClick={onClick}>Export Project</Button>
        </Dialog>
    )
}