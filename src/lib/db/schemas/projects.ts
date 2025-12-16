import { Generated, Selectable,Insertable, Updateable } from "kysely";

export interface ProjectTable {
    id: Generated<number>;
    name: string;
    owner_id: string;
}

export interface ProjectCounts {
    trains: number;
    train_stations: number;
}

export type ProjectWithCounts = Selectable<ProjectTable> & ProjectCounts;

export type Project = Selectable<ProjectTable>;
export type CreateProject = Insertable<ProjectTable>;
export type UpdateProject = Updateable<ProjectTable>;