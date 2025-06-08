'use client';
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { Button } from "primereact/button";
import { handleAddStops } from "@/lib/actions/trains";
import MultiTrainStationSelect from "@/components/MultiTrainStationSelect";



export interface NewTrainStationModalProps {
    visible: boolean,
    onHide: () => void,
    projectId: number,
    trainId: number
}

export default function TimetableStopModal({visible, onHide, projectId, trainId}: NewTrainStationModalProps) {

    const [ stationIds, setStationIds] = useState<number[]>([]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (stationIds.length === 0) return;

        await handleAddStops({
            stationIds,
            trainId
        })

        _onHide();
    }

    const _onHide = () => {
        setStationIds([]);
        onHide();
    }

  
    return (
        <>
            <Dialog visible={visible} header="Add stops to this train's timetable" onHide={() => _onHide()} >
                <form onSubmit={onSubmit}>
                <div className="flex flex-col gap-4">
                    <MultiTrainStationSelect 
                        projectId={projectId} 
                        value={stationIds} 
                        onChange={setStationIds}
                    />
                </div>
                <Button label="Add stops" type="submit" />
                </form>
            </Dialog>
        </>
    );
}