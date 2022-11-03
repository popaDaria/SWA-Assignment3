import { useEffect, useState } from 'react'
import { getAllGames } from '../api/GamesApi'
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';
import { GameData } from '../slices/gameSlice';

export default function Scores() {
    const [games, setGames] = useState<GameData[]>([]);
    const currentUserId: number = useAppSelector((state: RootState) => state.user.id);

    if (games.length === 0)
        getAllGames('0d6085eec7f2b14d24527f64552a02a1').then((result) => setGames(result))

    return (
        <div>
            <div>
                Top 10 Scores:
                {games.filter((game) => game.completed).sort((game) => game.score).map((game) => (
                    <div key={game.id}>Game {game.id} - Score: {game.score}</div>
                ))}
            </div>
            <div>
                Your Top 3 Scores:
                {games.filter((game) => game.completed && game.user === currentUserId).sort((game) => game.score).map((game) => (
                    <div key={game.id}>Game {game.id} - Score: {game.score}</div>
                ))}
            </div>
        </div>
    )
}