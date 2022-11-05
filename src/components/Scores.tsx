import { useState } from 'react'
import { getAllGames } from '../api/GamesApi'
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';
import { GameData } from '../slices/gameSlice';

export default function Scores() {
    const token = useAppSelector((state: RootState) => state.user.token);

    const [games, setGames] = useState<GameData[]>([]);
    const currentUserId: number = useAppSelector((state: RootState) => state.user.userId);

    if (games.length === 0) {
        getAllGames(token).then((result) => {
            setGames(result);
        })
    }

    return (
        <div className='mt-5'>
            <div className='mt-5'>
                <h2>Top 10 Scores:</h2>
                <div className='d-flex flex-row flex-wrap'>
                    {games.filter((game) => game.completed).sort((a, b) => b.score - a.score).splice(0, 10).map((game) => (
                        <div className='alert alert-info m-auto mb-2' key={game.id}>Player {game.user} - {game.score} points</div>
                    ))}
                </div>
            </div>
            <div>
                <h2 className='mt-3'>Your Top 3 Scores:</h2>
                {games.filter((game) => game.completed && game.user === currentUserId).sort((a, b) => b.score - a.score).splice(0, 3).map((game) => (
                    <div className='alert alert-info' key={game.id}>Game {game.id} - Score: {game.score}</div>
                ))}
            </div>
        </div>
    )
}