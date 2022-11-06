import { useState } from "react";
import { useAppSelector } from "../app/hooks";
import { RootState } from "../app/store";
import { GameData } from "../slices/gameSlice";
import { changePassword, getAllGames, getUser } from "../api/GamesApi";

export default function Profile() {
    const user = useAppSelector((state: RootState) => state.user);

    const [games, setGames] = useState<GameData[]>([]);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handlePasswordChange = event => {
        setPassword(event.target.value);
    };
    if (games.length === 0) {
        getAllGames(user.token).then((result) => {
            setGames(result);
        })
        getUser(user.token, user.userId).then((result) => {
            setUsername(result.username);
        })
    }

    const changePasswordAction = () => {
        changePassword(user.token, password, user.userId);
    }


    return (
        <div className="mt-5">
            <h1 className="mt-3">Profile</h1>
            <h3>Username: <span style={{color: '#e83e8c'}}>{username}</span></h3>
            <div className='login-form form-group mb-3'>
                <div className='login-form-row form-group'>
                    <label htmlFor='password'>Change Password</label>
                    <input className="form-control" type='password' id='password' value={password} onChange={handlePasswordChange} />
                    <button className="btn btn-outline-warning form-control mt-1" onClick={changePasswordAction}>Send</button>
                </div>
            </div>
            <div>
                <h4>My Games:</h4>
                <div className='d-flex flex-row flex-wrap'>
                    {games.filter((game) => game.completed && game.user === user.userId).sort((a, b) => a.id - b.id).map((game) => (
                        <div className='alert alert-info m-auto mb-2' key={game.id}>Game {game.id} - Score: {game.score} - Moves left: {game.nrOfMoves}</div>
                    ))}
                </div>
            </div>
        </div>
    )
}