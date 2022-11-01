import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Board, Position } from "../model/board";

export interface PlayData {
    selectedPiece: Position | undefined;
    board: Board<string> | undefined;
    message: string;
    matches: Position[];
    initialSetup: boolean;
    score: number;
    calculatingMove: boolean;
    nrOfMoves: number;
    targetScore: number;
    completed: boolean;
}

const initialState: PlayData = {
    selectedPiece: undefined,
    board: undefined,
    message: '',
    matches: [],
    initialSetup: true,
    score: 0,
    calculatingMove: false,
    nrOfMoves: 10,
    targetScore: 200,
    completed: false
};

export const playSlice = createSlice({
    name: 'play',
    initialState,
    reducers: {
        setSelectedPiece: (state: PlayData, action: PayloadAction<Position | undefined>) => {
            state.selectedPiece = action.payload ? { row: action.payload.row, col: action.payload.col } : undefined;
        },
        setBoard: (state: PlayData, action: PayloadAction<Board<string> | undefined>) => {
            state.board = { ...action.payload };
        },
        setMessage: (state: PlayData, action: PayloadAction<string>) => {
            state.message = action.payload;
        },
        setMatches: (state: PlayData, action: PayloadAction<Position[]>) => {
            state.matches.push(...action.payload);
        },
        clearMatches: (state: PlayData) => {
            state.matches = [];
        },
        setInitialSetup: (state: PlayData, action: PayloadAction<boolean>) => {
            state.initialSetup = action.payload;
        },
        increaseScore: (state: PlayData, action: PayloadAction<number>) => {
            state.score += action.payload;
        },
        setCalculatingMove: (state: PlayData, action: PayloadAction<boolean>) => {
            state.calculatingMove = action.payload;
        },
        decreaseMoves: (state: PlayData) => {
            --state.nrOfMoves;
        },
        endGame: (state: PlayData) => {
            state.completed = true;
        },
    }
});

export const { setSelectedPiece,
    setBoard,
    setMessage,
    setMatches,
    setInitialSetup,
    clearMatches,
    increaseScore,
    setCalculatingMove,
    decreaseMoves,
    endGame } = playSlice.actions;
export default playSlice.reducer;