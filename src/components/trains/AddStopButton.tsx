'use client';

import { Button } from "primereact/button";
import TimetableStopModal from "./modals/TimetableStopModal";
import { useState } from "react";

export default function AddStopButton({projectId, trainId}: {projectId: number, trainId: number}) {

    const [ showModal, setShowModal ] = useState(false);

    return (
        <>
            <Button label="Add stop" onClick={(e) => {
                e.preventDefault();
                setShowModal(true);
            }}/>
            <TimetableStopModal onHide={
                    () => setShowModal(false)
                } 
                visible={showModal} 
                projectId={projectId} 
                trainId={trainId}
            />
        </>
    );
}