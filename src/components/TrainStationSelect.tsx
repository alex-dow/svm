'use client';

import { handleGetTrainStations } from "@/lib/actions/trainStations";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";

export interface TrainStationSelectProps {
    projectId: number,
    value?: number,
    onChange: (e: number) => void
}

export default function TrainStationSelect({projectId, value, onChange}: TrainStationSelectProps) {

    const [ loading, setLoading ] = useState(false);
    const [ stations, setStations ] = useState<{id: number, name: string}[]>([]);

    useEffect(() => {
        setLoading(true);
        handleGetTrainStations(projectId)
        .then((res) => {
            setStations(res);
            setLoading(false);
        })
        .catch((err) => {
            console.error(err);
            setLoading(false);
        })
    },[projectId]);

    return (
        <Dropdown 
            loading={loading} 
            options={stations} 
            optionLabel="name" 
            optionValue="id" 
            placeholder="Select a station" 
            value={value}
            filter
            onChange={(e) => onChange(e.value)}
        />
    )

}