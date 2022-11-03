import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RandomGenerator } from "../components/Board";
import { Board } from "../model/board";
import * as BoardModel from '../model/board'

export interface GameData {
    user: number;
    id: number;
    board: Board<string>;
    score: number;
    nrOfMoves: number;
    targetScore: number;
    completed: boolean;
}

const generator: RandomGenerator = new RandomGenerator('A,B,C,D');
const initBoard = BoardModel.create(generator, 5, 5);
BoardModel.handleMatches(BoardModel.getMatches(initBoard), initBoard, generator, [])

const initialState: GameData = {
    user: 0,
    id: 0,
    board: initBoard,
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
            state = { ...state }
            for (let keys in state) {
                if (action.payload[keys] && state[keys] !== action.payload[keys]) {
                    state[keys] = action.payload[keys];
                }
            }
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
    setGameData,
    setBoard,
    increaseScore,
    decreaseMoves,
    endGame } = gameSlice.actions;
export default gameSlice.reducer;