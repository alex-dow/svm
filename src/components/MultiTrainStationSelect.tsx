'use client';

import { handleGetTrainStations } from "@/lib/actions/trainStations";
import { MultiSelect } from "primereact/multiselect";
import { useEffect, useState } from "react";

export interface MultiTrainStationSelectProps {
    projectId: number,
    value: number[],
    onChange: (e: number[]) => void
}

export default function MultiTrainStationSelect({projectId, value, onChange}: MultiTrainStationSelectProps) {

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
        <MultiSelect
            loading={loading} 
            options={stations} 
            optionLabel="name" 
            optionValue="id" 
            placeholder="Select stations" 
            value={value}
            filter
            display="chip"
            onChange={(e) => onChange(e.value)}
        />
    )

}