import { Generated, Selectable,Insertable, Updateable } from "kysely";

export interface ProjectTable {
    id: Generated<number>;
    name: string;
    owner_id: string;
}

export type Project = Selectable<ProjectTable>;
export type CreateProject = Insertable<ProjectTable>;
export type UpdateProject = Updateable<ProjectTable>;