'use client';
import { handleCreateTrain } from "@/lib/actions/trains";
import { handleCreateTrainStation } from "@/lib/actions/trainStations";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

export interface NewTrainModalProps {
    visible: boolean,
    onHide: () => void,
    projectId: number,
}

export default function NewTrainModal({visible, onHide, projectId}: NewTrainModalProps) {

    const [ trainName, setTrainName] = useState('');
    const [ saving, setSaving ] = useState(false);
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const train = await handleCreateTrain(trainName, projectId);
            onHide();
            router.push('/projects/' + projectId + '/trains/train/' + train?.id);
            setTrainName('');
        } catch (err) {
            console.error(err);
        }
        setSaving(false);
    }

    return (
        <Dialog visible={visible} header="Create a new train" onHide={() => onHide()} >
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <InputText 
                    value={trainName} 
                    onChange={(e) => setTrainName(e.target.value)} 
                    disabled={saving}
                    id="new-station-name-input"
                    placeholder="Train name"
                />
                

                <Button 
                    label="Save" 
                    icon="pi pi-save" 
                    type="submit" 
                    disabled={saving} 
                />
            </form>
        </Dialog>
    );
}