'use client';
import { Button } from "primereact/button";
import React, { useRef, useState } from "react";
import BusyModal from "../modals/BusyModal";
import { ButtonProps } from "primereact/button";
import { Toast } from "primereact/toast";

export interface ButtonWithBusyProps {
    onClick: (e: React.MouseEvent) => Promise<void>
    icon?: string;
    buttonLabel?: string;
    progressMessage?: React.ReactNode | string;
    severity?: ButtonProps['severity'];
}

export default function ButtonWithBusyModal(props: ButtonWithBusyProps) {

    const [ busy, setBusy ] = useState(false);

    const toast = useRef<Toast | null>(null);

    const onClick = async (e: React.MouseEvent) => {
        setBusy(true);
        try {
            await props.onClick(e);
        } catch (err) {
            let errMsg: string;
            if (err instanceof Error) {
                errMsg = err.message;
            } else {
                errMsg = 'Unknown error';
            }
            console.error(err);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: errMsg,
                life: 3000
            });
            
        }
        setBusy(false);
    }

    return (
        <>
            <Toast ref={toast} />
            <Button
                className="p-1 pt-1.5 w-8" 
                icon={props.icon} 
                severity={props.severity} 
                outlined
                size="small"
                onClick={onClick}
                label={props.buttonLabel}
            />
            <BusyModal visible={busy} onHide={() => setBusy(false)}>
                { props.progressMessage }
            </BusyModal>
        </>
    )

}