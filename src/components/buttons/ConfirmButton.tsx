'use client';
import { Button } from "primereact/button";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { ButtonProps } from "primereact/button";
import { MouseEventHandler } from "react";

export interface ConfirmButtonProps {
    message: string,
    accept: () => void,
    reject?: () => void
    popupIcon?: string,
    icon?: string,
    label?: string,
    severity?: ButtonProps['severity'],
    size?: ButtonProps['size'],
    className?: ButtonProps['className'],
    id?: string,
    rounded?: boolean,
    outlined?: boolean
}

export default function ConfirmButton(props: ConfirmButtonProps) {
    const onClick: MouseEventHandler = (e) => {
        confirmPopup({
            target: e.currentTarget as HTMLElement,
            message: props.message,
            icon: props.popupIcon,
            accept: props.accept,
            reject: props.reject
        });
    }

    return (
        <>
        <ConfirmPopup/>
        <Button 
            label={props.label} 
            icon={props.icon} 
            severity={props.severity} 
            id={props.id} 
            onClick={onClick}
            rounded={props.rounded}
            outlined={props.outlined}
            size={props.size}
            className={props.className}
        />
        </>

    )
}