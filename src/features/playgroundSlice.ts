import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import GridCell from "../components/GridCell";

import initValues from "../functions/initialValueForPlayground";
import Color from "../properties/Color";

interface PlaygroundState {
  value: {
    speed: number;
    colonies: number;
    radiation: number;
    minerals: number;
    matrixSize: [number, number];
    initialPlayground: GridCell[][];
    firstRun: boolean;
  };
}

const initialState: PlaygroundState = {
  value: {
    speed: 2000, // Скорость обновления площадки. Начальное - 2 сек/день
    colonies: 4, // Количество колоний в начале. По-умолчанию 4
    radiation: 10, // Энергия солнца
    minerals: 10, // Количество минералов
    matrixSize: [105, 60], // размер матрицы
    initialPlayground: initValues([105, 60]),
    firstRun: true,
  },
};

export const playgroundSlice = createSlice({
  name: "playground",
  initialState,
  reducers: {
    setOneCell: (
      state,
      action: PayloadAction<{ x: number; y: number; color: Color }>
    ) => {
      state.value.initialPlayground[action.payload.x][action.payload.y] = {
        ...state.value.initialPlayground[action.payload.x][action.payload.y],
        color: action.payload.color,
      };
    },
    firstRun: (state) => {
      state.value.firstRun = false;
    },
  },
});

export const { setOneCell, firstRun } = playgroundSlice.actions;
export const selectCount = (state: RootState) => state.playground.value;
export default playgroundSlice.reducer;
