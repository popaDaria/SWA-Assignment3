import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Board from './components/Board';

import {
  BrowserRouter, Routes, Route, Link
} from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { RootState } from './app/store';
import { login, logout } from './slices/userSlice';

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
            <Route path="/login">
              {/* <Profile /> */}
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/scores">
                {/* <Scores /> */}
              </Route>
              <Route path="/" element={<Board />} />
              <Route path="/profile">
                {/* <Profile /> */}
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
