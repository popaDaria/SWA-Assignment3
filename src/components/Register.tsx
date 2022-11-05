import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../api/GamesApi";

export default function Register() {
    const navigate = useNavigate();

    const [message, setMessage] = useState('');
    const register = () => {
        if (password === password2) {
            registerUser(username, password).then((result) => {
                if (result !== 'Username already taken') {
                    setMessage("")
                    navigate('/');
                } else {
                    setMessage(result);
                }
            });
        } else {
            setMessage('Passwords do not match');
        }
    }

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const handleUsernameChange = event => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = event => {
        setPassword(event.target.value);
    };

    const handlePassword2Change = event => {
        setPassword2(event.target.value);
    };

    return (
        <div className='register-container'>
            <h1>Register</h1>
            <div className='register-form'>
                <div className='register-form-row form-group mt-3'>
                    <label htmlFor='username'>Username</label>
                    <input type='text' id='username' value={username} onChange={handleUsernameChange} className='form-control' />
                </div>
                <div className='register-form-row form-group mt-3'>
                    <label htmlFor='password'>Password</label>
                    <input type='password' id='password' value={password} onChange={handlePasswordChange} className='form-control' />
                </div>
                <div className='register-form-row form-group mt-3'>
                    <label htmlFor='password2'>Repeat password</label>
                    <input type='password' id='password2' value={password2} onChange={handlePassword2Change} className='form-control' />
                </div>
                <div className='register-form-row form-group mt-3'>
                    <button className="btn btn-outline-success form-control" onClick={register}>Register</button>
                </div>
                <div className='register-form-row form-group mt-3'>
                    <label htmlFor='login'>Already have an account?</label>
                    <Link className="btn btn-outline-warning form-control mt-1" id='login' to='/login'>Login</Link>
                </div>
                <div className='register-form-row'>
                    <label htmlFor='message'>{message}</label>
                </div>
            </div>
        </div>
    )
}