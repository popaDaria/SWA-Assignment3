import {useState} from "react";
import {useAppSelector} from "../app/hooks";
import {RootState} from "../app/store";
import {GameData} from "../slices/gameSlice";
import {changePassword, getAllGames, getUser} from "../api/GamesApi";

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
        <div>
            <h1>Profile</h1>
            <div>Username: {username}</div>
            <div>
                My Games:
                {games.filter((game) => game.completed).sort((a, b) => a.id - b.id).map((game) => (
                    <div key={game.id}>Game {game.id} - Score: {game.score} - Moves left: {game.nrOfMoves}</div>
                ))}
            </div>
            <div className='login-form'>
                <div className='login-form-row'>
                    <label htmlFor='password'>Change Password</label>
                    <input type='password' id='password' value={password} onChange={handlePasswordChange}/>
                </div>
                <div className='login-form-row'>
                    <button onClick={changePasswordAction}>Send</button>
                </div>
            </div>
        </div>
    )
}