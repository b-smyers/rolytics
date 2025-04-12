import { useState, useEffect, useRef } from 'react';
import DropdownSelector from '../components/DropdownSelector';
import ToggleSwitch from '../components/ToggleSwitch';
import axios from 'axios';
import './Settings.css';
import PageLayout from '../layouts/PageLayout';

function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'auto');
  const [currency, setCurrency] = useState('R$');
  const [abbreviateUserCounts, setAbbreviateUserCounts] = useState(true);

  const initialThemeRef = useRef(theme);
  const settingsSavedRef = useRef(false);

  const loadSettings = async () => {
    try {
      const response = await axios.get('/api/v1/users/settings');
      const settings = response.data.data.settings;
      setTheme(settings.theme);
      setCurrency(settings.currency);
      setAbbreviateUserCounts(settings.abbreviateUserCounts);
      initialThemeRef.current = settings.theme;
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

  // Update locally saved theme
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);

    return () => {
      // Revert the theme when the user changes pages
      if (!settingsSavedRef.current && initialThemeRef.current !== theme) {
        document.documentElement.className = initialThemeRef.current;
        localStorage.setItem('theme', initialThemeRef.current);
      }
    };
  }, [theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/v1/users/settings', {
        settings: { theme, currency, abbreviateUserCounts }
      });

      if (response.status === 200) {
        console.log(response.data.data.message);
        settingsSavedRef.current = true;
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
            selected={theme?.charAt(0).toUpperCase() + theme?.slice(1)} 
            options={["Auto", "Light", "Dark"]}
            onChange={(e) => {
              settingsSavedRef.current = false;
              setTheme(e.target.value.toLowerCase())
            }}
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
