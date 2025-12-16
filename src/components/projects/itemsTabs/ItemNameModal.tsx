'use client';

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Controller, useForm } from "react-hook-form";

export type ItemModalProps = {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    onSubmit: (name: string, projectId: number) => void;
    header?: React.ReactNode;
    name?: string;
    id?: string;
    projectId: number;
}

export type NameFormFields = {
  name: string;
}

export default function ItemNameModal(props: ItemModalProps) {
  const { visible, setVisible, onSubmit, header, id, name, projectId } = props;


  const nameValidation = {
    required: true,
  };

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<NameFormFields>({
    defaultValues: {
      name: name || "",
    },
  });
  return (
    <Dialog
      header={header}
      id={id}
      visible={visible}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
      }}
    >
      <form
        id={`new-item-form-${id}`}
        onSubmit={handleSubmit((data) => onSubmit(data.name, projectId))}
        className="flex gap-2"
      >
        <div className="p-inputgroup flex-1">
          <Controller
            name="name"
            control={control}
            rules={nameValidation}
            render={({ field }) => (
              <InputText
                {...field}
                id="name-input"
                invalid={errors.name ? true : false}
                size="small"
                autoComplete="off"
              />
            )}
          />
          
          <Button label="Save" type="submit" data-testid="new-item-submit" disabled={!isValid} icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  )
}