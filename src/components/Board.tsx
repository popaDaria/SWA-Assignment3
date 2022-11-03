import React, { useEffect, useState } from 'react';

import { Generator } from '../model/board'
import * as BoardModel from '../model/board'
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { RootState } from '../app/store';
import {
    setSelectedPiece,
    setMessage,
    setMatches,
    setInitialSetup,
    clearMatches,
    setCalculatingMove,
} from '../slices/playSlice';
import {
    setBoard,
    increaseScore,
    decreaseMoves,
    endGame
} from '../slices/gameSlice'
import './Board.css';

class RandomGenerator implements Generator<string> {
    private values: string[];
    private min: number;
    private max: number;

    constructor(values: string) {
        this.values = values.split(',');
        this.min = 0;
        this.max = this.values.length - 1;
    }

    next(): string {
        const index = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min; //get random index in range
        return this.values[index];
    }
}

type ElementProps = {
    rowIndex: number;
    colIndex: number;
    element: string;
}

export function BoardRowElement({ rowIndex, colIndex, element }: ElementProps) {

    const dispatch = useAppDispatch();
    const firstSelected: BoardModel.Position | undefined = useAppSelector((state: RootState) => state.play.selectedPiece);
    const board: BoardModel.Board<string> | undefined = useAppSelector((state: RootState) => state.game.board);
    const matches: BoardModel.Position[] = useAppSelector((state: RootState) => state.play.matches);
    const calculatingMove: boolean = useAppSelector((state: RootState) => state.play.calculatingMove);
    const completed: boolean = useAppSelector((state: RootState) => state.game.completed);

    const score: number = useAppSelector((state: RootState) => state.game.score);
    const moves: number = useAppSelector((state: RootState) => state.game.nrOfMoves);
    const targetScore: number = useAppSelector((state: RootState) => state.game.targetScore);

    const generator: Generator<string> = new RandomGenerator('A,B,C,D');
    const [selected, setSelected] = useState<boolean>(false);

    useEffect(() => {
        if (!firstSelected) {
            setSelected(false)
        }
    }, [firstSelected, setSelected])

    function timeout(delay: number) {
        return new Promise(res => setTimeout(res, delay));
    }

    const selectedElement = async () => {
        if (!calculatingMove && !completed) {
            setSelected(true)
            if (firstSelected) {
                dispatch(setCalculatingMove(true)) // block user for making other moves until we resolve this
                const moveResults: BoardModel.MoveResult<string> = BoardModel.move(generator, { ...board }, firstSelected, { row: rowIndex, col: colIndex })
                if (moveResults.effects.length > 0) {
                    dispatch(decreaseMoves()) //made a valid move, decrease nr of moves left this game
                    const newBoard: BoardModel.Board<string> = JSON.parse(JSON.stringify(board)) as typeof board;
                    newBoard.content[firstSelected.row][firstSelected.col] = BoardModel.piece(newBoard, { row: rowIndex, col: colIndex });
                    newBoard.content[rowIndex][colIndex] = BoardModel.piece(board, firstSelected);
                    dispatch(setBoard(newBoard))
                    dispatch(setSelectedPiece(undefined))
                    setSelected(false)
                    for (let effect of moveResults.effects) {
                        if (effect.kind === 'Match') {
                            dispatch(increaseScore((effect.match.positions.length - 2) * 5)) // 5 points for a 3 match, +5 points for each additional piece in a match (i.e. a 5 piece match is 15 points)
                            dispatch(setMatches(effect.match.positions))
                        } else {
                            dispatch(setMessage("Making refill"))
                            await timeout(1000)
                            dispatch(setBoard(effect.board))
                            dispatch(setMessage(''))
                            dispatch(clearMatches())
                        }
                    }
                    await timeout(1000)
                    if (score >= targetScore || (moves === 0 && score < targetScore)) {
                        if (!completed) {
                            dispatch(endGame())
                        }
                    }
                } else {
                    dispatch(setMessage("CAN'T MAKE MOVE"))
                    setTimeout(() => {
                        dispatch(setMessage(''))
                    }, 1000);
                }
                dispatch(setSelectedPiece(undefined))
                setSelected(false)
                dispatch(setCalculatingMove(false)) //user can make moves again
            } else {
                dispatch(setSelectedPiece({ row: rowIndex, col: colIndex }))
            }
        }
    }
    return (
        <>
            <button className={(selected || (matches.some(pos => pos.row === rowIndex && pos.col === colIndex))) ? 'row-element row-element--selected' : 'row-element'} onClick={() => selectedElement()}>{element}</button>
        </>
    );
}

type Props = {
    rowIndex: number;
    row: string[];
}

export function BoardRow({ rowIndex, row }: Props) {
    return (
        <div>{row.map((element, colIndex) => <BoardRowElement key={'element' + rowIndex + colIndex} rowIndex={rowIndex} colIndex={colIndex} element={element} />)}</div>
    );
}

export default function Board() {

    const generator: Generator<string> = new RandomGenerator('A,B,C,D');
    let board: BoardModel.Board<string> = useAppSelector((state: RootState) => state.game.board) ?? BoardModel.create(generator, 5, 5);
    const initialSetup: boolean = useAppSelector((state: RootState) => state.play.initialSetup);
    const message: string = useAppSelector((state: RootState) => state.play.message);
    const score: number = useAppSelector((state: RootState) => state.game.score);
    const moves: number = useAppSelector((state: RootState) => state.game.nrOfMoves);
    const targetScore: number = useAppSelector((state: RootState) => state.game.targetScore);
    const completed: boolean = useAppSelector((state: RootState) => state.game.completed);
    const dispatch = useAppDispatch();

    if (BoardModel.getMatches(board).length !== 0 && initialSetup) {
        dispatch(setInitialSetup(false))
        BoardModel.handleMatches(BoardModel.getMatches(board), board, generator, []) //handle initial matches
        dispatch(setBoard(board))
    }

    return (
        <>
            {!completed ? (
                <div className='play-info'>
                    <div className='play-target-score'>
                        TARGET SCORE: {targetScore}
                    </div>
                    <div className='play-score'>
                        YOUR SCORE: {score}
                    </div>
                    <div className='play-moves'>
                        MOVES LEFT: {moves}
                    </div>
                </div>
            ) : (
                <div className='play-end'>
                    GAME OVER!
                </div>
            )}
            <div className='board'>
                {board.content ? board.content.map((row, rowIndex) => <BoardRow key={'row' + rowIndex} rowIndex={rowIndex} row={row} />) : null}
            </div>
            <div className='play-message'>
                {message}
            </div>
        </>
    );
}
