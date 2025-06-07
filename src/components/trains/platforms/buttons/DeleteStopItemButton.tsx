'use client';
import { handleRemoveStopItem } from "@/lib/actions/trains";
import { Button } from "primereact/button";

export function DeleteStopItemButton({stopItemId}: {stopItemId: number}) {

    const onClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        await handleRemoveStopItem(stopItemId);
    }

    return (
        <>
            <Button onClick={onClick} severity="danger" title="Delete item" icon="pi pi-trash" className="p-1 pt-1.5 w-8" size="small" outlined/>
        </>
    )
}