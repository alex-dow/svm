'use client';
import { Inplace, InplaceContent, InplaceDisplay } from "primereact/inplace";
import NavLink from "../layout/NavLink";
import DeleteStationButton from "./buttons/DeleteStationButton";
import EditTrainStationButton from "./buttons/EditTrainStationButton";
import { FormEvent, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { handleSaveStationName } from "@/lib/actions/trainStations";

export interface TrainStationsListItemProps {
    stationName: string,
    stationId: number,
    projectId: number
};

export function TrainStationsListItem({stationName, stationId, projectId}: TrainStationsListItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [newStationName, setNewStationName] = useState(stationName);

    const onSave = async (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        await handleSaveStationName(stationId, newStationName);
        setIsEditing(false);
    }

    return (
        <li className="flex flex-1">
            <Inplace className="flex-1 flex" pt={{display: { className: 'p-0 flex-1 flex gap-1 items-center justify-between'}, content: { className: 'p-0 flex-1'}}} active={isEditing} onOpen={() => setIsEditing(true)} onClose={() => setIsEditing(false)}>
                <InplaceDisplay>
                    <NavLink
                        href={'/projects/' + projectId + '/trains/stations/' + stationId}
                        className="p-0.5 hover:bg-gray-800 flex flex-1 py-1.5"
                    >
                        {stationName}
                    </NavLink>                    
                    <div className="flex gap-1">
                        <EditTrainStationButton stationId={stationId} onClick={() => setIsEditing(true)}/>
                        <DeleteStationButton projectId={projectId} stationId={stationId}  />
                    </div>                    
                </InplaceDisplay>
                <InplaceContent>
                <form onSubmit={onSave}>
                    <div className="p-inputgroup flex-1">
                        <InputText 
                            value={newStationName} 
                            onChange={(e) => setNewStationName(e.target.value)}
                            autoFocus
                            pt={{
                                root: {
                                    className: 'p-1 pr-2'
                                }
                            }}
                        />
                        <Button icon="pi pi-save" outlined type="submit" className="p-0.5"/>
                        <Button icon="pi pi-times" severity="info" outlined type="button" className="p-0.5" onClick={() => setIsEditing(false)}/>
                    </div>
                </form>
                </InplaceContent>
            </Inplace>

        </li>
    )
}