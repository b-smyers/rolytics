import { useState, useEffect } from 'react';
import axios from 'axios';
import './Account.css';
import PageLayout from '../layouts/PageLayout';
import CopyToClipboardButton from '../components/CopyToClipboardButton';

function Account() {
  const [apiKey, setApiKey] = useState('API Key');
  const [username, setUsername] = useState('Username');
  const [email, setEmail] = useState('Email');

  const loadAccount = async () => {
    try {
      const response = await axios.get('/api/v1/users/profile');
      const profile = response.data.data.profile;
      setApiKey(profile.api_key);
      setUsername(profile.username);
      setEmail(profile.email);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.data) {
        console.log(error.response.data.data.message);
      } else {
        console.log('An unexpected error occurred');
      }
    }
  }

  useEffect(() => {
    loadAccount();
  }, []);

  return (
    <PageLayout title={"Account"}>
      <div id='account-details'>
        <div className='account-entry'>
          <h2>Username</h2>
          <div className="account-input-container">
            <input
              type="text"
              value={username}
              disabled
            />
          </div>
        </div>
        <div className='account-entry'>
          <h2>Email</h2>
          <div className="account-input-container">
            <input
              type="text"
              value={email}
              disabled
            />
          </div>
        </div>
        <div className='account-entry'>
          <h2>API Key</h2>
          <div className="account-input-container">
            <input
              type="text"
              value={apiKey}
              disabled
            />
            <CopyToClipboardButton id="clipboard-button" text={apiKey} />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default Account
