import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import TodoList from './components/TodoList';

function Component() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Router>
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/todos" />
                ) : (
                  <SignIn onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/signup"
              element={
                isAuthenticated ? (
                  <Navigate to="/todos" />
                ) : (
                  <SignUp onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/todos"
              element={
                isAuthenticated ? (
                  <TodoList onLogout={handleLogout} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default Component;