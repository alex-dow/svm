import { Button, ButtonProps } from "primereact/button";

export default function RowActionButton(props: ButtonProps) {
    return (
        <Button {...props} className="p-1 pt-1.5 w-8" outlined size="small"/>
    )
}