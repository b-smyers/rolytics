import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isValidPass, setIsValidPass] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(
      email.trim() !== '' &&
      username.trim() !== '' &&
      isValidPass
    );
  }, [email, username, isValidPass]);

  function updatePasswordRequirements(newPassword) {
    const requirements = [
      { // 8 character minimum
        id: "pass-req-1",
        test: (pw) => pw.length >= 8,
      },
      { // 1 digit minimum
        id: "pass-req-2",
        test: (pw) => (pw.match(/\d/g) || []).length >= 1,
      },
      { // 1 uppercase minimum
        id: "pass-req-3",
        test: (pw) => (pw.match(/[A-Z]/) || []).length >= 1
      },
      { // 1 lowercase minimum
        id: "pass-req-4",
        test: (pw) => (pw.match(/[a-z]/) || []).length >= 1
      },
      { // 1 special minimum
        id: "pass-req-5",
        test: (pw) => (pw.match(/[@$!%*?&#]/) || []).length >= 1
      }
    ];

    let valid = true;

    requirements.forEach(({ id, test }) => {
      const element = document.getElementById(id);
      if (test(newPassword)) {
        element.classList.remove("req-fail");
        element.classList.add("req-pass");
      } else {
        element.classList.remove("req-pass");
        element.classList.add("req-fail");
        valid = false;
      }
    });
  
    setIsValidPass(valid);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) { return; }

    try {
      const registerResponse = await axios.post('/api/v1/auth/register', { 
        username: username,
        email: email,
        password: password
      });

      if (registerResponse.status === 200) {
        console.log(registerResponse.data.data.message);
      }

      const loginResponse = await axios.post('/api/v1/auth/login', { 
        username: username,
        password: password
      });

      if (loginResponse.status === 200) {
        console.log(loginResponse.data.data.message);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.data) {
        console.log(error.response.data.data.message);
      } else {
        console.log('An unexpected error occurred');
      }
    }
  };

  return (
    <div className='background'>
        <div id='stars'/>
        <div id='register-box'>
          <div id='form-box'>
            <div id='form-header'>
              <h1>Register</h1>
              <img src="/logos/rolytics.svg" alt="Rolytics Logo" />
            </div>
            <p>Welcome to Rolytics!</p>
            <form id='register-form' onSubmit={handleSubmit}>
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
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  const newPassword = e.target.value;
                  setPassword(newPassword);
                  updatePasswordRequirements(newPassword);
                }}
                required
              />
              <div id="password-requirements">
                <p>Passwords must contain at least:</p>
                <ul>
                  <li id="pass-req-1">8 characters</li>
                  <li id="pass-req-2">1 number</li>
                  <li id="pass-req-3">1 uppercase alphabet</li>
                  <li id="pass-req-4">1 lowercase alphabet</li>
                  <li id="pass-req-5">1 special character</li>
                </ul>
              </div>
              <button id="register-button" type="submit" disabled={!isFormValid}>
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
