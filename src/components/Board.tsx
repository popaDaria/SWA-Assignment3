import React, { useEffect, useState } from 'react';

import { Generator } from '../model/board'
import * as BoardModel from '../model/board'
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { RootState } from '../app/store';
import {
    setSelectedPiece,
    setMessage,
    setMatches,
    clearMatches,
    setCalculatingMove,
} from '../slices/playSlice';
import {
    setGameData,
    setBoard,
    increaseScore,
    decreaseMoves,
    endGame,
    GameData, emptyGameData, initializeNewBoard
} from '../slices/gameSlice'
import './Board.css';
import { getAllGames, getGameById, startNewGame, updateGame } from '../api/GamesApi';
import { UserData } from '../slices/userSlice';

export class RandomGenerator implements Generator<string> {
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
    const game: GameData = useAppSelector((state: RootState) => state.game);
    const matches: BoardModel.Position[] = useAppSelector((state: RootState) => state.play.matches);
    const calculatingMove: boolean = useAppSelector((state: RootState) => state.play.calculatingMove);
    const token: string = useAppSelector((state: RootState) => state.user.token);

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
        if (!calculatingMove && !game.completed) {
            setSelected(true)
            if (firstSelected) {
                dispatch(setCalculatingMove(true)) // block user for making other moves until we resolve this
                const moveResults: BoardModel.MoveResult<string> = BoardModel.move(generator, { ...game.board }, firstSelected, { row: rowIndex, col: colIndex })
                if (moveResults.effects.length > 0) {
                    dispatch(decreaseMoves()) //made a valid move, decrease nr of moves left this game
                    const newBoard: BoardModel.Board<string> = JSON.parse(JSON.stringify(game.board)) as typeof game.board;
                    newBoard.content[firstSelected.row][firstSelected.col] = BoardModel.piece(newBoard, { row: rowIndex, col: colIndex });
                    newBoard.content[rowIndex][colIndex] = BoardModel.piece(game.board, firstSelected);
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
    const currentUser: UserData = useAppSelector((state: RootState) => state.user);
    const game: GameData = useAppSelector((state: RootState) => state.game);
    const message: string = useAppSelector((state: RootState) => state.play.message);
    const calculatingMove: boolean = useAppSelector((state: RootState) => state.play.calculatingMove);
    const [playStarted, setPlayStarted] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const [games, setGames] = useState<GameData[]>([]);

    const continueGame = (id: number) => {
        setPlayStarted(false);
        dispatch(emptyGameData());
        getGameById(currentUser.token, id).then((result) => { dispatch(setGameData(result)) }).then(() => setPlayStarted(true))
    }

    const startAnotherGame = () => {
        setPlayStarted(false);
        dispatch(emptyGameData());
        dispatch(initializeNewBoard());
        startNewGame(currentUser.token)
            .then((result) => { dispatch(setGameData(result)), updateGame(currentUser.token, result.id, { ...game, id: result.id, user: currentUser.userId }) })
            .then(() => setPlayStarted(true));
    }

    const backToMain = () => {
        setPlayStarted(false);
    }

    useEffect(() => {
        if (!playStarted) {
            getAllGames(currentUser.token).then((result) => setGames(result))
        }
    }, [playStarted])

    useEffect(() => {
        if (!calculatingMove && playStarted) {
            if (game.score >= game.targetScore || (game.nrOfMoves === 0 && game.score < game.targetScore)) {
                dispatch(endGame())
                updateGame(currentUser.token, game.id, { ...game, completed: true })
            } else {
                updateGame(currentUser.token, game.id, game)
            }
        }
    }, [game.nrOfMoves, calculatingMove, game.board])

    return (
        <>
            {playStarted ? (
                <>
                    <div>
                        {calculatingMove ? null : <button onClick={() => backToMain()}>Back to main page</button>}
                    </div>
                    {!game.completed ? (
                        <div className='play-info'>
                            <div className='play-target-score'>
                                TARGET SCORE: {game.targetScore}
                            </div>
                            <div className='play-score'>
                                YOUR SCORE: {game.score}
                            </div>
                            <div className='play-moves'>
                                MOVES LEFT: {game.nrOfMoves}
                            </div>
                        </div>
                    ) : (
                        <div className='play-end'>
                            {game.score >= game.targetScore ? (<div>Congrats! You won with a score of {game.score} and {game.nrOfMoves} moves left.</div>)
                                : (<div>You were {(game.targetScore - game.score)} points away! Try again?</div>)}
                        </div>
                    )}
                    <div className='board'>
                        {game.board ? game.board.content ? game.board.content.map((row, rowIndex) => <BoardRow key={'row' + rowIndex} rowIndex={rowIndex} row={row} />) : null : null}
                    </div>
                    <div className='play-message'>
                        {message}
                    </div>
                </>
            ) : (
                <div>
                    <div>Continue your games:</div>
                    {games.filter((game) => !game.completed && game.user === currentUser.userId).map((game) => (
                        <button key={game.id} onClick={() => continueGame(game.id)}>Game {game.id}</button>
                    ))}
                    <div>
                        Start a new game:
                        <button onClick={() => startAnotherGame()}>New Game</button>
                    </div>
                </div>
            )}
        </>
    );
}
