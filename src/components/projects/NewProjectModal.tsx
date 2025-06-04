'use client';
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Toast } from "primereact/toast";
import { handleCreateProject } from "@/lib/actions/projects";

export default function NewProjectModal({visible, onHide}: {visible: boolean, onHide: () => void}) {

    const [ projectName, setProjectName] = useState('');

    const [ saving, setSaving ] = useState(false);
    const router = useRouter();
    const toast = useRef<Toast>(null);

    const session = authClient.useSession();

    const onSubmit = async () => {
        
        try {
            if (!session.data) {
                router.push('/login');
            } else {
            
                const newProject = await handleCreateProject(projectName);
                router.push('/projects/' + newProject?.id);
            }
        } catch (err) {
            console.error(err);
            if (err instanceof Error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: err.message });
            } else {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'An unknown error occurred' });
            }
        }
        setSaving(false);
    }

    
    return (
        <>
            <Toast ref={toast} />
            <Dialog visible={visible} header="Create a new project" onHide={() => onHide()}>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    await onSubmit()
                }}>
                    <InputText value={projectName} onChange={(e) => setProjectName(e.target.value)} disabled={saving}/>
                    <div>
                        <Button label="Save" icon="pi pi-save" type="submit" disabled={saving} onClick={(e) => {e.preventDefault(); onSubmit();}} />
                    </div>        
                </form>
        </Dialog>
    </>
    );
}