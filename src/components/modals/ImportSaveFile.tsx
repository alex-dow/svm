/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { SaveFileParserEvent, SaveFileParserEventType, SaveFilePlatform, SaveFileTrain, SaveFileTrainStation, SelectedItemsForImport } from "@/lib/types";
import { Dialog } from "primereact/dialog";
import { useEffect, useRef, useState } from "react";
import Working from "./ImportSaveFile/Working";
import { Error } from "./ImportSaveFile/Error";
import SelectSaveFile from "./ImportSaveFile/SelectSaveFile";
import SelectImportableItems from "./ImportSaveFile/SelectImportableItems";
import { createProject } from "@/lib/services/projects";
import { importStations } from "@/lib/services/stations";
import { redirect, useRouter } from "next/navigation";
import { createTrainConsist } from "@/lib/services/trains";
import { addTrainWagons } from "@/lib/services/trainWagons";
import { authClient } from "@/lib/auth-client";

export interface ImportSaveFileProps {
    visible: boolean,
    onHide: () => void,
    header?: React.ReactNode | string,
}

/**
 * 
 * states: new | parsing | parsing-finished | importing | importing-finished | error
 */

export default function ImportSaveFile({visible, onHide, header}: ImportSaveFileProps) {

    const session = authClient.useSession();

    const workerRef = useRef<Worker>(null);
    const [file, setFile] = useState<File | null>(null);
    const [phase, setPhase] = useState<'new' | 'parsing' | 'parsing-finished' | 'importing' | 'importing-finished' | 'error'>('new');

    // save game data
    const [ trainStations, setTrainStations ] = useState<SaveFileTrainStation[]>([]);
    const [ trains, setTrains ] = useState<SaveFileTrain[]>([]);

    const [ saveName, setSaveName ] = useState('');

    const router = useRouter();

    // job state
    const [working, setWorking] = useState(false);
    const [jobState, setJobState ] = useState<SaveFileParserEventType>();
    const [parsingProgress, setParsingProgress] = useState(0);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {

        workerRef.current = new Worker(new URL('../../workers/saveFileWorker', import.meta.url));
        workerRef.current.onerror = (e) => {
            console.error('Web worker error - e.error: ', e.error, ' - e.lineo: ', e.lineno, ' - e.message:', e.message);
            console.error(e);
            setError(true);
        }

        workerRef.current.onmessageerror = (e) => {
            console.error('web worker message error:', e);
            setError(true);
        }

        workerRef.current.onmessage = (e: MessageEvent<SaveFileParserEvent<unknown>>) => {
            
            if (e.data.type === 'parsing-progress') {
                setParsingProgress(e.data.data as number);
            } else if (e.data.type === 'save-name') {
                setSaveName(e.data.data as string);
            } else if (e.data.type === 'train-stations') {
                console.log('worker message:', e);
                setTrainStations(e.data.data as {id: string, label: string, platforms: SaveFilePlatform[]}[]);
            } else if (e.data.type === 'trains') {
                console.log('worker message:', e);
                setTrains(e.data.data as {id: string, label: string, wagons: []}[]);
            } else if (e.data.type === 'finished') {
                setPhase('parsing-finished');
            } else if (e.data.type === 'error') {
                setPhase('error');
                setError(true);
                setErrorMsg(e.data.data as string);
            }
        };

        return () => {
          workerRef.current?.terminate();
        };
      }, []);

    const onAnalyzeSaveFile = async (file: File) => {
        setPhase('parsing');
        setError(false);
        setFile(file);

        if (!workerRef.current) {
            setError(true);
            setErrorMsg('Save file work not initialized');
            return;
        }

        workerRef.current.postMessage(file);
    }

    const onImportItems = async (items: SelectedItemsForImport) => {
        if (!session.data) {
            redirect('/login');
        }
        setPhase('importing');
        setError(false);

        try {
            const project = await createProject(saveName, session.data.user.id);
            if (!project) {
                console.error('failed to create project');
                setError(true);
                setPhase('error');
                return;
            }

            await importStations(items.trainStations, project.id);

            for (let i = 0; i < items.trains.length; i++) {
                const trainName = items.trains[i].label;
                const train = await createTrainConsist(trainName, project.id);
                if (!train) {
                    console.error('failed to create train');
                    setError(true);
                    setPhase('error');
                    return;
                }

                await addTrainWagons(train.id, items.trains[i].wagons);
            }
            router.push(`/projects/${project.id}`);
        } catch (err) {
            console.error(err);
        }

        setPhase('importing-finished');
    }
    
    return (
        <Dialog 
            visible={visible} 
            onHide={onHide} 
            closable={false} 
            dismissableMask={false} 
            header={header} 
            modal={true}
            style={{width: '50%'}}
        >

            { phase === 'new' && (
                <SelectSaveFile onAnalyzeSaveFile={onAnalyzeSaveFile}/>
            )}
            
            { phase === 'parsing' && (
                <Working />
            )}

            { phase === 'parsing-finished' && (
                <SelectImportableItems trainStations={trainStations} trains={trains} onImportItems={onImportItems} saveName={saveName}/>
            )}

            { phase === 'importing' && (
                <Working />
            )}

            { phase === 'importing-finished' && (
                <p>Importing finished!</p>
            )}
            
            { phase === 'error' && (
                <Error />
            )}

        </Dialog>
    );
}