import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Position } from "../model/board";

export interface PlayData {
    selectedPiece: Position | undefined;
    message: string;
    matches: Position[];
    calculatingMove: boolean;
}

const initialState: PlayData = {
    selectedPiece: undefined,
    message: '',
    matches: [],
    calculatingMove: false,
};

export const playSlice = createSlice({
    name: 'play',
    initialState,
    reducers: {
        setSelectedPiece: (state: PlayData, action: PayloadAction<Position | undefined>) => {
            state.selectedPiece = action.payload ? { row: action.payload.row, col: action.payload.col } : undefined;
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
        setCalculatingMove: (state: PlayData, action: PayloadAction<boolean>) => {
            state.calculatingMove = action.payload;
        }
    }
});

export const { setSelectedPiece,
    setMessage,
    setMatches,
    clearMatches,
    setCalculatingMove } = playSlice.actions;
export default playSlice.reducer;