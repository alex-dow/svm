'use client';
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import Loading from "../Loading";
import { Button } from "primereact/button";
import { handleImportProject } from "@/lib/actions/projects";
import { useRouter } from "next/navigation";

export interface ImportProjectModalProps {
    visible: boolean,
    onHide: () => void
}

export default function ImportProjectModal({visible, onHide}: ImportProjectModalProps) {

    const [ working, setWorking ] = useState(false);
    const [ exportFile, setExportFile ] = useState<File | null>(null);

    const router = useRouter();

    const onSubmit = async () => {
        if (!exportFile) return;
        setWorking(true);

        try {
            const decoder = new TextDecoder();
            const buffer = await exportFile.arrayBuffer();

            const exportJson = JSON.parse(decoder.decode(buffer));
            const projectId = await handleImportProject(exportJson);
            router.push('/projects/' + projectId);
        } catch (err) {
            console.error(err);
        }
        setWorking(false);
    }

    return (
        <Dialog
            visible={visible} 
            onHide={onHide} 
            closable={false} 
            dismissableMask={false} 
            header="Import project"
            modal={true}
            style={{width: '50%'}}
        >
            { working && <Loading />}
            { !working && 
                <form onSubmit={onSubmit}>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <input type="file" name="save-file" onChange={(e) => setExportFile(e.target.files?.[0] || null)} accept=".json"/>
                            <Button type="submit" severity="info" label="Import save file" disabled={!exportFile}   />
                        </div>
                    </div>
                </form>
            }
        </Dialog>
    );
}