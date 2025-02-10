import { useState, useEffect } from 'react';
import DropdownSelector from '../components/DropdownSelector';
import ToggleSwitch from '../components/ToggleSwitch';
import axios from 'axios';
import './Settings.css';
import PageLayout from '../layouts/PageLayout';

function Settings() {
  const [theme, setTheme] = useState('Auto');
  const [currency, setCurrency] = useState('R$');
  const [abbreviateUserCounts, setAbbreviateUserCounts] = useState(true);

  const loadSettings = async () => {
    try {
      const response = await axios.get('/api/v1/users/settings');
      const settings = response.data.data.settings;
      setTheme(settings.theme);
      setCurrency(settings.currency);
      setAbbreviateUserCounts(settings.abbreviateUserCounts);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.data) {
        console.log(error.response.data.data.message);
      } else {
        console.log('An unexpected error occurred');
      }
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/v1/users/settings', { 
        theme,
        currency,
        abbreviateUserCounts
      });

      if (response.status === 200) {
        console.log(response.data.data.message);
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
    <PageLayout title={"Settings"}>
      <form id='settings-form' onSubmit={handleSubmit}>
        <div className='setting-entry'>
          <h2>Theme</h2>
          <DropdownSelector 
            name={"Theme"} 
            selected={theme} 
            options={["Auto", "Light", "Dark"]}
            onChange={(e) => setTheme(e.target.value)}
          />
        </div>
        <div className='setting-entry'>
          <h2>Currency</h2>
          <DropdownSelector 
            name={"Currency"} 
            selected={currency} 
            options={["R$", "USD", "EUR"]}
            onChange={(e) => setCurrency(e.target.value)}
          />
        </div>
        <div className='setting-entry'>
          <h2>Abbreviate User Counts</h2>
          <ToggleSwitch
            name={"Abbreviate User Counts"}
            selected={abbreviateUserCounts}
            onChange={(state) => setAbbreviateUserCounts(state)}  
          />
        </div>
        <div className='setting-entry'>
          <button id="save-settings-button" type="submit">Save Changes</button>
        </div>
      </form>
    </PageLayout>
  )
}

export default Settings
