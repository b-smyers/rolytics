import { useState, useEffect } from 'react';
import axios from 'axios';
import './Account.css';
import PageLayout from '../layouts/PageLayout';

function Account() {
  const [apiKey, setApiKey] = useState('');

  const loadAccount = async () => {
    try {
      const response = await axios.get('/api/v1/users/profile');
      const profile = response.data.data.profile;
      setApiKey(profile.api_key);
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
      <div className='account-entry'>
        <h2>API Key</h2>
        <input
          type="text"
          name="api-key"
          id="api-key"
          placeholder="API Key"
          value={apiKey}
          disabled
        />
      </div>
    </PageLayout>
  )
}

export default Account
