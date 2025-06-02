'use client';
import { Button } from "primereact/button";
import { useState } from "react";

export default function SelectSaveFile({onAnalyzeSaveFile}: {onAnalyzeSaveFile: (file: File) => void}) {

    const [ file, setFile ] = useState<File | null>(null);
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
            return;
        }
        onAnalyzeSaveFile(file);
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                    <input type="file" name="save-file" onChange={(e) => setFile(e.target.files?.[0] || null)} accept=".sav"/>
                    <Button type="submit" severity="info" label="Import save file" disabled={!file}   />
                </div>
            </div>
        </form>
    )
}