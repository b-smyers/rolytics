import React, { useState } from 'react';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic (API request, validation, etc.)
    console.log('Login attempt with:', { username, password });
  };
  
  return (
    <>
      <div id='background'>
        <div id='stars'/>
        <div id='login-box'>
          <div id='form-box'>
            <div id='form-header'>
              <h1>Login</h1>
              <img src="/icons/rolytics-android-chrome-192x192.png" alt="Rolytics Logo" />
            </div>
            <p>Welcome Back!</p>
            <form id='login-form' onSubmit={handleSubmit}>
              <input
                type="username"
                name="username"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <a href="/404">Forgot Password?</a>
              <button id="login-button" type="submit">
                Login
              </button>
            </form>
            <a href="/register">Don't have an account?</a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
