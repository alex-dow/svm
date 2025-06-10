import { ItemType } from "../satisfactory/data";

export type StationMode = 'loading' | 'unloading';

export type SaveFileParserEventType = 'parsing'| 'parsing-progress' | 'error' | 'loading' | 'collecting-items' | 'finished' | 'train-stations' | 'collected-items' | 'save-name' | 'trains';

export type SaveFileWorkerCommandType = 'collect-items' | 'collect-train-stations';

export interface CollectedItems {
    trainStations: {[key: string]: string};
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

export interface NetworkOverviewItem {
    id: number,
    item_classname: ItemType,
    rate: number,
    mode: StationMode,
    position: number,
    station_id: number
}

export type StopWithStation = {
    id: number;
    station_id: number;
    consist_id: number;
    position: number;
    station_name: string;
}
