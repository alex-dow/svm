/**
 * Processing the save file will convert raw types into simplified types
 * defined here
 */

import { ItemType } from "@/lib/satisfactory/data"
import { StationMode } from ".."


/**
 * Represents a stop on a time table
 * 
 * Holds the instance name of the station, and the IDs (eg: Desc_Coal_C)
 * of the items being loaded and/or unloaded
 */
export interface ImportTrainTimetableStop {
    /**
     * Instance name of the station the train is stopping at
     */
    stationInstanceName: string,

    /**
     * List of item ids the train is loading at this stop
     */
    loadingItems: ItemType[],

    /**
     * List of item ids the train is unloading at this stop
     */
    unloadingItems: ItemType[]
}

/**
 * Represents a complete train
 */
export interface ImportTrain {
    instanceName: string,
    trainName: string,
    wagons: number,
    timetable: ImportTrainTimetableStop[]
}

export interface ImportTrainStationPlatform {
    mode: StationMode,
    instanceName: string,
}

export interface ImportTrainStation {
    instanceName: string,
    platforms: ImportTrainStationPlatform[]
    stationName: string,
    stationInstanceName: string
}