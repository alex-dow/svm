import { StationMode } from "."
import { ItemType } from "../satisfactory/data"

export interface ExportTrainStationPlatformItem {
    id: number,
    item_classname: ItemType,
    rate: number
    platform_id: number
}

export interface ExportTrainStationPlatform {
    id: number,
    position: number,
    train_station_id: number,
    mode: StationMode,
    items: ExportTrainStationPlatformItem[]
}

export interface ExportTrainStation {
    id: number,
    name: string,
    platforms: ExportTrainStationPlatform[]
}

export interface ExportTrain {
    id: number,
    name: string,
    wagons: number,
    timetable: ExportTimetableStop[]
}

export interface ExportTimetableStopItem {
    id: number,
    item_classname: ItemType,
    mode: StationMode
}

export interface ExportTimetableStop {
    id: number,
    station_id: number,
    position: number,
    consist_id: number,
    items: ExportTimetableStopItem[]
}
