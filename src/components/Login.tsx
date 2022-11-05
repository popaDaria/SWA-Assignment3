import {Link} from "react-router-dom";
import {login} from "../slices/userSlice";
import {useAppDispatch} from "../app/hooks";
import {useState} from "react";
import {loginUser} from "../api/GamesApi";
import {useNavigate} from 'react-router-dom';


export default function Login() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleUsernameChange = event => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = event => {
        setPassword(event.target.value);
    };

    const logIn = () => {
        loginUser(username, password).then((result) => {
            if (result !== 'Invalid username or password') {
                dispatch(login(result));
                setMessage("")
                navigate('/');
            } else {
                setMessage(result);
            }
        });
    };

    return (
        <div className='login-container'>
            <h1>Login</h1>
            <div className='login-form'>
                <div className='login-form-row form-group mt-3'>
                    <label htmlFor='username'>Username</label>
                    <input type='text' id='username' value={username} onChange={handleUsernameChange} className='form-control'/>
                </div>
                <div className='login-form-row form-group mt-1'>
                    <label htmlFor='password'>Password</label>
                    <input type='password' id='password' value={password} onChange={handlePasswordChange} className='form-control'/>
                </div>
                <div className='login-form-row form-group'>
                    <button className="btn btn-outline-success form-control mt-3" onClick={logIn}>Login</button>
                </div>
                <div className='login-form-row form-group mt-3'>
                    <label htmlFor='register'>Don't have an account?</label>
                    <Link id='register' to='/register' className="btn btn-outline-warning form-control mt-1">Register</Link>
                </div>
                <div className='login-form-row'>
                    <label>{message}</label>
                </div>
            </div>
        </div>
    )
}