import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import playReducer from '../slices/playSlice';
import userReducer from '../slices/userSlice';
import gameReducer from '../slices/gameSlice';

export const store = configureStore({
  reducer: {
    play: playReducer,
    user: userReducer,
    game: gameReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
