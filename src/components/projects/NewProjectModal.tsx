import { createProjectAction } from "@/lib/actions/projects";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useToastContext } from "../contexts/ToastContextProvider";

interface NewProjectFormFields {
  projectName: string;
}

const projectNameValidation = {
  required: "Name is required",
};

export interface NewProjectModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export default function NewProjectModal(props: NewProjectModalProps) {
  const { visible, setVisible } = props;
  const showToast = useToastContext()?.showToast;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("project-name") as string;
    try {
      const project = await createProjectAction(name);
      if (project) {
        setVisible(false);
        showToast?.({
          severity: "success",
          summary: "Project created",
          detail: "Project created successfully",
        });
      }
    } catch (err) {
      showToast?.({
        severity: "error",
        summary: "Error",
        detail: "An error occurred while creating the project",
      });
      console.error(err);
    }
  };

  return (
    <Dialog
      header="Create a new project"
      id="new-project-modal"
      visible={visible}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
      }}
    >
      <form
        id="new-project-form"
        onSubmit={handleSubmit}
        className="flex gap-2"
      >
        <div className="p-inputgroup flex-1">
          <InputText
            placeholder="Project name"
            required
            id="new-project-name"
            name="project-name"
            autoFocus
          />
          <Button label="Create" type="submit" id="new-project-submit" />
        </div>
      </form>
    </Dialog>
  );
}
