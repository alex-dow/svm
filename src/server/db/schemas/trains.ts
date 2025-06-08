import { ItemType } from "@/lib/satisfactory/data";
import { StationMode } from "@/lib/types";
import { Generated, Insertable, Selectable, Updateable } from "kysely";



export interface TrainTable {
    id: Generated<number>;
    name: string;
    project_id: number;
    owner_id: string;
    wagons: number;
}
export type Train = Selectable<TrainTable>;
export type CreateTrain = Insertable<TrainTable>;
export type UpdateTrain = Updateable<TrainTable>;

export interface TrainTimetableStopTable {
    id: Generated<number>;
    consist_id: number;
    station_id: number;
    owner_id: string;
    position: number;
}
export type TrainTimetableStop = Selectable<TrainTimetableStopTable>;
export type CreateTrainTimetableStop = Insertable<TrainTimetableStopTable>;
export type UpdateTrainTimestableStop = Updateable<TrainTimetableStopTable>;

export interface TrainTimetableStopItemTable {
    id: Generated<number>;
    stop_id: number;
    owner_id: string;
    item_id: ItemType;
    mode: StationMode
}

export type TrainTimetableStopItem = Selectable<TrainTimetableStopItemTable>;
export type CreateTrainTimetableStopItem = Insertable<TrainTimetableStopItemTable>;
export type UpateTrainTimetableStopItem = Updateable<TrainTimetableStopItemTable>;