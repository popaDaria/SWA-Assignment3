import React from 'react';
import './App.css';
import Board from './components/Board';

import {
  BrowserRouter, Routes, Route, Link
} from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { RootState } from './app/store';
import { logout } from './slices/userSlice';
import Scores from './components/Scores';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from "./components/Register";
import {logoutUser} from "./api/GamesApi";

function App() {
  const token = useAppSelector((state: RootState) => state.user.token);
  const dispatch = useAppDispatch();

  const logOut = () => {
    logoutUser(token).then(() => dispatch(logout()));
  };

  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <div className="nav-body">
            <nav>
              <div className="navBar-ul">
                <Link to="/" className='btn btn-outline-info'>Play Game</Link>
                <Link to="/scores" className='btn btn-outline-info'>High Scores</Link>
                {token ? (
                  <>
                    <Link to="/profile" className='btn btn-outline-info'>Profile</Link>
                    <Link to="/login" onClick={logOut} className='btn btn-outline-info'>Logout</Link>
                  </>
                ) : (
                  <Link to="/login" className='btn btn-outline-info'>Login</Link>
                )}
              </div>
            </nav>
          </div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />}/>
            <Route element={<ProtectedRoute />}>
              <Route path="/scores" element={<Scores />} />
              <Route path="/" element={<Board />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
