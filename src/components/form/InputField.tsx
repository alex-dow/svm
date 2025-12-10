import { FloatLabel } from "primereact/floatlabel";
import { Message } from "primereact/message";
export interface InputFieldProps {
  label?: string;
  children?: React.ReactNode;
  invalid?: boolean;
  invalidMessage?: string;
  inputId?: string;
}

export default function InputField(props: InputFieldProps) {
  const { label, children, invalid, invalidMessage, inputId } = props;
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={inputId}>{label}</label>}
      {children}
      {invalid && (
        <div className="flex gap-2 items-center p-0.5">
          <i className="pi pi-exclamation-triangle" />
          <small className="text-red-500 font-bold" id={`${inputId}-error`}>
            {invalidMessage}
          </small>
        </div>
      )}
    </div>
  );
}
