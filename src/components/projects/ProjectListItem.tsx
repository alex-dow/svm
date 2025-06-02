"use client";
import Link from "next/link";
import { Button } from "primereact/button";

export default function ProjectListItem({projectId, name}: Readonly<{projectId: number, name: string}>) {
    return (
        <div>
            <Link href={"/projects/" + projectId} className="flex justify-between">
                <div>{name}</div>
                <Button size="small" severity="danger" outlined icon="pi pi-trash"/>
            </Link>
        </div>
    )
}