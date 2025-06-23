'use client';

import { handleAddPlatformItem, handleUpdatePlatformItem } from "@/lib/actions/trainStations";
import { TrainStationPlatformItem } from "@/server/db/schemas/trainStations";
import { Button } from "primereact/button";
import { Inplace, InplaceContent, InplaceDisplay } from "primereact/inplace";
import { InputNumber } from "primereact/inputnumber";
import { FormEvent, useState } from "react";

export default function ItemListRate({item, platformId}: {item: TrainStationPlatformItem, platformId: number}) {

    const [rate, setRate] = useState(item.rate);
    const [isEditing, setIsEditing] = useState(false);

    const onSave = async (e: FormEvent) => {
        e.preventDefault();
        
        try {
            await handleUpdatePlatformItem(platformId, item.id, rate);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Inplace pt={{display: { className: 'p-0'}}} className="flex-1 flex justify-end" active={isEditing} onOpen={() => setIsEditing(true)} onClose={() => setIsEditing(false)}>
            <InplaceDisplay>
                <div>{item.rate} / min</div>
            </InplaceDisplay>
            <InplaceContent>
                <form onSubmit={onSave}>
                    <div className="p-inputgroup w-48">
                        <InputNumber value={rate} onChange={(e) => setRate(e.value ?? 0)} pt={{
                            input: {
                                root: {
                                    className: 'text-right p-1 pr-2'
                                }
                            }
                        }}
                        autoFocus
                        />
                        <span className="p-inputgroup-addon px-2 py-0">/ min</span>
                        <Button icon="pi pi-save" outlined type="submit" className="p-0.5"/>
                        <Button icon="pi pi-times" severity="info" outlined type="button" className="p-0.5" onClick={() => setIsEditing(false)}/>
                    </div>
                </form>
            </InplaceContent>
        </Inplace>
    )
}