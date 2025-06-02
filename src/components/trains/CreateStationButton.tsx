'use client';
import { Button } from "primereact/button";
import NewTrainStationModal from "./modals/NewTrainStationModal";
import { useState } from "react";

export default function CreateStationButton({ projectId}: {projectId: number}) {

    const [showNewStationModal, setShowNewStationModal] = useState(false);

     return (
        <>
            <Button outlined className="p-1 gap-2 items-center" icon="pi pi-plus" size="small" severity="warning" onClick={() => setShowNewStationModal(true)}>Create station</Button>
            <NewTrainStationModal visible={showNewStationModal} projectId={projectId} onHide={() => setShowNewStationModal(false)}/>
        </>
    )
}