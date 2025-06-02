import { TrainStation } from "@/server/db/schemas/trainStations";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TrainStationState {
    currentTrainStation: TrainStation | null
    
}

const initialState: TrainStationState = {
    currentTrainStation: null
}

export const trainStationSlice = createSlice({
    name: 'train-station',
    initialState,
    reducers: {
        setTrainStation: (state, action: PayloadAction<TrainStation | null>) => {
            state.currentTrainStation = action.payload
        }
    }
});

export const { setTrainStation } = trainStationSlice.actions;
export default trainStationSlice.reducer;