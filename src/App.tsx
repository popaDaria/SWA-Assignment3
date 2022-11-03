import React from 'react';
import './App.css';
import Board from './components/Board';

import {
  BrowserRouter, Routes, Route, Link
} from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { RootState } from './app/store';
import { login, logout } from './slices/userSlice';
import Scores from './components/Scores';
import Profile from './components/Profile';
import Login from './components/Login';

function App() {
  const token = useAppSelector((state: RootState) => state.user.token);
  const dispatch = useAppDispatch();

  const logIn = () => {
    dispatch(login({ username: 'asdasf', password: 'sdfsdf', token: 'smth' }))
  };

  const logOut = () => {
    dispatch(logout())
  };

  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <div className="nav-body">
            <nav>
              <div className="navBar-ul">
                <Link to="/">Play Game</Link>
                <Link to="/scores">High Scores</Link>
                {token ? (
                  <>
                    <Link to="/profile">Profile</Link>
                    <Link to="/login" onClick={logOut}>Logout</Link>
                  </>
                ) : (
                  <Link to="/login" onClick={logIn}>Login</Link>
                )}
              </div>
            </nav>
          </div>
          <Routes>
            <Route path="/login" element={<Login />} />
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
