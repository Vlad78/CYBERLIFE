import { configureStore } from "@reduxjs/toolkit";
import PlaygroundReducer from "../features/playgroundSlice";

export const store = configureStore({
  reducer: {
    playground: PlaygroundReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
