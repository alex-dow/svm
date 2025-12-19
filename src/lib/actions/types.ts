export type CreateAction = (projectId: number, name: string) => Promise<unknown & { id: number, name: string }>;
export type RenameAction = (projectId: number, itemId: number, name: string) => Promise<unknown & {id: number, name: string}>;
export type DeleteAction = (projectId: number, itemId: number) => Promise<void>;
export type FetchAction = (projectId: number) => Promise<unknown & {id: number, name: string}[]>;