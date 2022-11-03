import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Board } from "../model/board";

export interface GameData {
    user: number;
    id: number;
    board: Board<string> | undefined;
    score: number;
    nrOfMoves: number;
    targetScore: number;
    completed: boolean;
}

const initialState: GameData = {
    user: 0,
    id: 0,
    board: undefined,
    score: 0,
    nrOfMoves: 15,
    targetScore: 200,
    completed: false
};

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGameData: (state: GameData, action: PayloadAction<GameData>) => {
            state = { ...action.payload };
            return state;
        },
        setBoard: (state: GameData, action: PayloadAction<Board<string> | undefined>) => {
            state.board = { ...action.payload };
        },
        increaseScore: (state: GameData, action: PayloadAction<number>) => {
            state.score += action.payload;
        },
        decreaseMoves: (state: GameData) => {
            --state.nrOfMoves;
        },
        endGame: (state: GameData) => {
            state.completed = true;
        },
    }
});

export const {
    setBoard,
    increaseScore,
    decreaseMoves,
    endGame } = gameSlice.actions;
export default gameSlice.reducer;