'use client';
import { deleteProject } from "@/lib/services/projects";
import ConfirmButton from "../buttons/ConfirmButton";
import { useRouter } from "next/navigation";

export interface DeleteProjectButtonProps {
    projectId: number
}

export default function DeleteProjectButton(props: DeleteProjectButtonProps) {
    
    const router = useRouter();

    const onDeleteProject = async () => {
        await deleteProject(props.projectId);
        router.push('/');
    }

    return (
        <ConfirmButton
            message="Are you sure you want to delete this project?"
            icon="pi pi-trash"
            outlined
            severity="danger"
            rounded
            accept={onDeleteProject}
        />
    )
}