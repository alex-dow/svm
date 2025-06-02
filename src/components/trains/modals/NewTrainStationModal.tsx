'use client';
import { createTrainStation } from "@/lib/services/stations";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

export interface NewTrainStationModalProps {
    visible: boolean,
    onHide: () => void,
    projectId: number,
}

export default function NewTrainStationModal({visible, onHide, projectId}: NewTrainStationModalProps) {

    const [ stationName, setStationName] = useState('');
    const [ saving, setSaving ] = useState(false);
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const newStation = await createTrainStation(stationName, projectId);
            if (!newStation) {
                throw new Error('Failed to create station');
            }
            onHide();
            router.push('/projects/' + projectId + '/trains/stations/' + newStation.id);
            setStationName('');
        } catch (err) {
            console.error(err);
        }
        setSaving(false);
    }

    return (
        <Dialog visible={visible} header="Create a new train station" onHide={() => onHide()} >
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <InputText 
                    value={stationName} 
                    onChange={(e) => setStationName(e.target.value)} 
                    disabled={saving}
                    id="new-station-name-input"
                    placeholder="Station name"
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