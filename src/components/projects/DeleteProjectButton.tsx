'use client';
import ConfirmButton from "../buttons/ConfirmButton";
import { redirect, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { handleDeleteProject } from "@/lib/actions/projects";

export interface DeleteProjectButtonProps {
    projectId: number
}

export default function DeleteProjectButton(props: DeleteProjectButtonProps) {
    const session = authClient.useSession();
    const router = useRouter();

    const onDeleteProject = async () => {
        if (!session.data) { redirect('/login')}
        await handleDeleteProject(props.projectId);
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