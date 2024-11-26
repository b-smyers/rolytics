import React, { useState } from 'react';
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle register logic (API request, validation, etc.)
    console.log('register attempt with:', { username, password });
  };

  return (
    <div className='background'>
        <div id='stars'/>
        <div id='register-box'>
          <div id='form-box'>
            <div id='form-header'>
              <h1>Register</h1>
              <img src="/icons/rolytics-android-chrome-192x192.png" alt="Rolytics Logo" />
            </div>
            <p>Welcome to Rolytics!</p>
            <form id='register-form' onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
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
              <div id="password-requirements">
                <p>Passwords must contain at least:</p>
                <ul>
                  <li>8 characters</li>
                  <li>1 number</li>
                  <li>1 uppercase alphabet</li>
                  <li>1 lowercase alphabet</li>
                </ul>
              </div>
              <button id="register-button" type="submit">
                Register
              </button>
            </form>
            <a href="/login">Already have an account?</a>
          </div>
        </div>
    </div>
  )
}

export default Register
