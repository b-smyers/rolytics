import { useState, useEffect } from 'react';
import PageCrumb from '../components/PageCrumb';
import BackButton from '../components/BackButton';
import DropdownSelector from '../components/DropdownSelector';
import ToggleSwitch from '../components/ToggleSwitch';
import axios from 'axios';
import './Settings.css';

function Settings() {
  const [theme, setTheme] = useState('Auto');
  const [currency, setCurrency] = useState('R$');
  const [abbreviateUserCounts, setAbbreviateUserCounts] = useState(true);

  const loadSettings = async () => {
    try {
      const response = await axios.get('/api/v1/users/settings');
      const settings = response.data.data.settings;
      for (const setting of settings) {
        if (setting.setting_key == "theme") {
          setTheme(setting.setting_value);
        } else if (setting.setting_key == "currency") {
          setCurrency(setting.setting_value);
        } else if (setting.setting_key == "abbreviateUserCounts") {
          setAbbreviateUserCounts(!!setting.setting_value);
        }
      }
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
    <div className='background'>
      <div id='stars'/>
      <div id="gradient">
        <div id="header">
          <div>
            <BackButton/>
            <PageCrumb/>
          </div>
          <h1>Settings</h1>
        </div>
      </div>
      <div id="settings-page">
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
            <h2></h2>
            <button id="save-settings-button" type="submit">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Settings
