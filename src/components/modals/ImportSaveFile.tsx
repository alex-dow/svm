/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { SaveFileParserEvent, SaveFileParserEventType } from "@/lib/types";
import { Dialog } from "primereact/dialog";
import { useEffect, useRef, useState } from "react";
import Working from "./ImportSaveFile/Working";
import { Error } from "./ImportSaveFile/Error";
import SelectSaveFile from "./ImportSaveFile/SelectSaveFile";
import SelectImportableItems from "./ImportSaveFile/SelectImportableItems";
import { redirect, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { handleImportSaveFileProject } from "@/lib/actions/projects";
import { ImportTrain, ImportTrainStation } from "@/lib/types/satisfactory/importSaveTypes";

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
    const [ trainStations, setTrainStations ] = useState<ImportTrainStation[]>([]);
    const [ trains, setTrains ] = useState<ImportTrain[]>([]);

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
                setTrainStations(e.data.data as ImportTrainStation[]);
            } else if (e.data.type === 'trains') {
                setTrains(e.data.data as ImportTrain[]);
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

    const onImportItems = async (items: {trainStations: ImportTrainStation[], trains: ImportTrain[]}) => {
        if (!session.data) {
            redirect('/login');
        }
        setPhase('importing');
        setError(false);

        try {
            const projectId = await handleImportSaveFileProject({
                projectName: saveName,
                saveFileTrains: items.trains,
                saveFileTrainStations: items.trainStations
            });
            
            router.push(`/projects/${projectId}`);
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