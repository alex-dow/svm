export type StationMode = 'loading' | 'unloading';

export type SaveFileParserEventType = 'parsing'| 'parsing-progress' | 'error' | 'loading' | 'collecting-items' | 'finished' | 'train-stations' | 'collected-items' | 'save-name' | 'trains';

export type SaveFileWorkerCommandType = 'collect-items' | 'collect-train-stations';

export interface CollectedItems {
    trainStations: {[key: string]: string};
}

export interface SelectedItemsForImport {
    trainStations: {id: string, label: string, platforms: SaveFilePlatform[]}[]
    trains: {id: string, label: string, wagons: number}[]
}

export interface SaveFileParserEvent<T> {
    type: SaveFileParserEventType,
    data?: T
}

export interface SaveFileWorkerCommand<T> {
    type: SaveFileWorkerCommandType,
    saveFile: File,
    data?: T
}


export interface SaveGameItem {
    id: string,
    label: string
}

export interface SaveFilePlatform {
    id: string,
    mode: boolean
}
export interface SaveFileTrainStation {
    id: string,
    label: string,
    platforms: SaveFilePlatform[]
}