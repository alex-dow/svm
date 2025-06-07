'use client';
import ConfirmButton from "@/components/buttons/ConfirmButton";
import { handleRemoveStop } from "@/lib/actions/trains";

export default function DeleteStopButton({stopId}: {stopId: number}) {

    const onAccept =  async () => {
        await handleRemoveStop(stopId);
    }

    return (
        <ConfirmButton 
            message="Are you sure you want to delete this stop?" 
            icon="pi pi-trash"
            outlined
            severity="danger"
            size="small"
            style={{
                height: '1rem', width: '1rem'
            }}
            
            rounded
            accept={onAccept}
        />
    )
}
