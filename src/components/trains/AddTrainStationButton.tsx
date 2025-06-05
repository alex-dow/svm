'use client';

import { Button } from "primereact/button";
import { useState } from "react";
import NewTrainStationModal from "./modals/NewTrainStationModal";

export default function AddTrainStationButton({projectId}: {projectId: number}) {
    const [ showModal, setShowModal ] = useState(false);

    return (
        <>
        <Button label="Add a station" onClick={() => setShowModal(true)}/>
        <NewTrainStationModal onHide={() => setShowModal(false)} visible={showModal} projectId={projectId}/>
        </>
    )
}