import { Generated, Insertable, Selectable, Updateable } from "kysely";



export interface TrainConsistTable {
    id: Generated<number>;
    name: string;
    project_id: number;
    owner_id: string;
}
export type TrainConsist = Selectable<TrainConsistTable>;
export type CreateTrainConsist = Insertable<TrainConsistTable>;
export type UpdateTrainConsist = Updateable<TrainConsistTable>;

export interface TrainWagonTable {
    id: Generated<number>;
    position: number;
    consist_id: number;
    owner_id: string;
}
export type TrainWagon = Selectable<TrainWagonTable>;
export type CreateTrainWagon = Insertable<TrainWagonTable>;
export type UpdateTrainWagon = Updateable<TrainWagonTable>;

export interface TrainTimetableStopTable {
    id: Generated<number>;
    consist_id: number;
    station_id: number;
    owner_id: number;
    position: number;
}
export type TrainTimetableStop = Selectable<TrainTimetableStopTable>;
export type CreateTrainTimetableStop = Insertable<TrainTimetableStopTable>;
export type UpdateTrainTimestableStop = Updateable<TrainTimetableStopTable>;