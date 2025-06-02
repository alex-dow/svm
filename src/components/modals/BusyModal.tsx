'use client';

import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";

export interface BusyModalProps {
    visible: boolean,
    onHide: () => void,
    children?: React.ReactNode | string
}

export default function BusyModal({visible, onHide, children}: BusyModalProps) {
    return (
        <Dialog visible={visible} onHide={onHide} closable={false} dismissableMask={false} header={(
            <div className="flex items-center gap-4">
                <ProgressSpinner className="w-10 h-10" />
                <div>
                    { children }
                </div>
            </div>      
        )} pt={{
            content: {
            className: "p-0"
            }
        }}/>
    )
}