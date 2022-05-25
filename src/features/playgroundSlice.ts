import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PGProps } from "../App";
import { RootState } from "../app/store";
import GridCell from "../components/GridCell";

import initValues from "../functions/initialValueForPlayground";
import Color from "../properties/Color";

interface PlaygroundState {
  value: GridCell[][];
}
console.log("slice");

const initialState: PlaygroundState = {
  value: PGProps.initialPlayground,
};

export const playgroundSlice = createSlice({
  name: "playground",
  initialState,
  reducers: {
    setOneCell: (
      state,
      action: PayloadAction<{ x: number; y: number; color: Color }>
    ) => {
      state.value[action.payload.x][action.payload.y] = {
        ...state.value[action.payload.x][action.payload.y],
        color: action.payload.color,
      };
    },
  },
});

export const { setOneCell } = playgroundSlice.actions;
export const selectCount = (state: RootState) => state.playground.value;
export default playgroundSlice.reducer;
