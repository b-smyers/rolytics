import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(
      username.trim() !== '' &&
      password.trim() !== ''
    );
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) { return; }

    try {
      const response = await axios.post('/api/v1/auth/login', { 
        username: username,
        password: password
      });

      if (response.status !== 200) { return; }

      console.log(response.data.data.message);

      // Compare settings timestamp
      const serverSettingsTimestamp = response.data.data.settings.lastModified;
      const localSettingsTimestamp = localStorage.getItem('settingsLastModified');
      if (!localSettingsTimestamp || localSettingsTimestamp != serverSettingsTimestamp) {
        console.log("Settings out of date");
        // Settings out of date, fetch them
        try {
          const response = await axios.get('/api/v1/users/settings');
          const settings = response.data.data.settings;
          localStorage.setItem('settingsLastModified', settings.lastModified);
          localStorage.setItem('theme', settings.theme);
          document.documentElement.className = settings.theme;
        } catch (error) {
          if (error.response && error.response.data && error.response.data.data) {
            console.log(error.response.data.data.message);
          } else {
            console.log('An unexpected error occurred');
          }
        }
      }
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.data) {
        console.log(error.response.data.data.message);
        setErrorMessage(error.response.data.data.message);
      } else {
        console.log('An unexpected error occurred');
        setErrorMessage('An unexpected error occurred');
      }
    }
  };
  
  return (
    <div className='background'>
      <div id='stars'/>
      <div id='login-box'>
        <div id='form-box'>
          <div id='form-header'>
            <h1>Login</h1>
            <img src="/logos/rolytics.svg" alt="Rolytics Logo" />
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
            {errorMessage && <div id="error-box">{errorMessage}</div>}
            <button id="login-button" type="submit" disabled={!isFormValid}>
              Login
            </button>
          </form>
          <a href="/register">Don&#39;t have an account?</a>
        </div>
      </div>
    </div>
  )
}

export default Login
