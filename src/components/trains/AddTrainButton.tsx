'use client';

import { Button } from "primereact/button";
import { useState } from "react";
import NewTrainModal from "./modals/NewTrainModal";

export default function AddTrainButton({projectId}: {projectId: number}) {
    const [ showModal, setShowModal ] = useState(false);

    return (
        <>
        <Button label="Add a train" onClick={() => setShowModal(true)}/>
        <NewTrainModal onHide={() => setShowModal(false)} visible={showModal} projectId={projectId}/>
        </>
    )
}