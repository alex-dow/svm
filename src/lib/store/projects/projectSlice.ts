import { Project } from "@/server/db/schemas/projects";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProjectState {
    currentProject: Project | null
}

const initialState: ProjectState = {
    currentProject: null
}

export const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        setProject: (state, action: PayloadAction<Project | null>) => {
            state.currentProject = action.payload
        }
    }
});

export const { setProject } = projectSlice.actions;
export default projectSlice.reducer;