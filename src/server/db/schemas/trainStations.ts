import { ItemType } from "@/lib/satisfactory/data";
import { StationMode } from "@/lib/types";
import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface TrainStationTable {
    id: Generated<number>;
    name: string;
    project_id: number;
    owner_id: string;
}
export type TrainStation = Selectable<TrainStationTable>
export type CreateTrainStation = Insertable<TrainStationTable>
export type UpdateTrainStation = Updateable<TrainStationTable>

export interface TrainStationPlatformTable {
    id: Generated<number>;
    mode: StationMode;
    train_station_id: number;
    position: number;
    owner_id: string;
}
export type TrainStationPlatform = Selectable<TrainStationPlatformTable>
export type CreateTrainStationPlatform = Insertable<TrainStationPlatformTable>;
export type UpdateTrainStationPlatform = Updateable<TrainStationPlatformTable>;

export interface TrainStationPlatformItemTable {
    id: Generated<number>;
    item_classname: ItemType;
    rate: number;
    platform_id: number;
    owner_id: string;
}
export type TrainStationPlatformItem = Selectable<TrainStationPlatformItemTable>;
export type CreateTrainStationPlatformItem = Insertable<TrainStationPlatformItemTable>;
export type UpdateTrainStationPlatformItem = Updateable<TrainStationPlatformItemTable>;