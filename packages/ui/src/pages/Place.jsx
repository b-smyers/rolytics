import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LineGraph from '../components/LineGraph';
import TrendIndicator from '../components/TrendIndicator';
import PageLayout from '../layouts/PageLayout';
import axios from 'axios';
import './Place.css';

async function getPlace(experience_id, place_id) {
  try {
    const response = await axios.get(`/api/v1/places`, {
      params: { experience_id }
    });
    const places = response.data.data.places;
    
    const place = places.find(exp => exp.place_id === parseInt(place_id));
    
    return place || {};
  } catch (error) {
    if (error.response && error.response.data && error.response.data.data) {
      console.log(error.response.data.data.message);
    } else {
      console.log('An unexpected error occurred:', error.status);
    }
    
    return {};
  }
}

function toDisplayString(key = "Missing") {
  return key.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function Place() {
  const navigate = useNavigate();

  const [sources, setSources] = useState({
    players: { keys: [], data: [] },
    purchases: { keys: [], data: [] },
    analytics: { keys: [], data: [] },
    performance: { keys: [], data: [] },
    social: { keys: [], data: [] }
  });

  const [experience, setExperience] = useState({});
  const [place, setPlace] = useState({});

  const [servers, setServers] = useState([]);

  // Default to first source
  const [selectedSource, setSelectedSource] = useState(Object.keys(sources)[0] || 'none');
  // Default to first key of each source (don't show empty graph by default)
  const [selectedKeys, setSelectedKeys] = useState({
    players: [],
    purchases: [],
    analytics: [],
    performance: [],
    social: []
  });

  const { experience_id, place_id } = useParams();

  const checkPlace = useCallback(async () => {
    const placeData = await getPlace(experience_id, place_id);
    setPlace(placeData);
    // redirect to experiences page if place does not exist/user does not own this place
    if (!placeData.name) {
      navigate('/dashboard/experiences');
    }
  }, [experience_id, place_id, navigate]);

  const fetchSourceData = async (source) => {
    // Load data from initally selected source
    // All other data will be loaded ONCE when the source is changed (further updates will be updated from the refresh button)
    // Get analytics data
    try {
      const response = await axios.get(`/api/v1/places/${source}`, {
        params: { place_id }
      });
      const { keys, data } = response.data.data;

      // Convert all timestamps to negative minutes from the current time
      const now = new Date(); // ms
      data.forEach((point, i) => {
        const timestamp = new Date(Math.floor(point.timestamp)) // ms
        const diff = (now - timestamp) / 1000 / 60; // minutes
        const hours = Math.floor(diff / 60);
        const minutes = Math.floor(diff % 60);
        const seconds = Math.floor((diff - Math.floor(diff)) * 60);
        data[i].timestamp = `-${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      });

      // Enable a key if there are keys and none are selected
      if (keys?.length === 0) {
        setSelectedKeys({ ...selectedKeys, [source]: [keys[0]] });
      }

      setSources({ ...sources, [source]: { keys, data } });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.data) {
        console.log(error.response.data.data.message);
      } else {
        console.log('An error occurred getting source data:', error.status || error);
      }
    }
  };

  const fetchServerData = async () => {
    // Get server data
    try {
      const response = await axios.get(`/api/v1/servers?place_id=${place_id}`);
      
      setServers(response.data.data.servers);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.data) {
        console.log(error.response.data.data.message);
      } else {
        console.log('An error occurred getting place data:', error.status);
      }
    }
  };

  useEffect(() => {
    checkPlace();
    fetchSourceData(selectedSource);
    fetchServerData();
  }, []); // Run once on mount


  function handleSourceChange(e) {
    const { name } = e.target;
    // Fetch data for the new source if it hasn't been fetched yet
    if (!sources[name]?.data?.length) {
      fetchSourceData(name);
    }
    setSelectedSource(name);
  }

  function handleKeyChange(e) {
    const { name, checked } = e.target;
    const newKeys = checked
      ? [...selectedKeys[selectedSource], name]
      : selectedKeys[selectedSource].filter(key => key !== name);
    setSelectedKeys({ ...selectedKeys, [selectedSource]: newKeys });
  }
  
  return (
    <PageLayout title={place.name || "Loading..."}>
      <div id='place-page'>
       <div id="grid-layout">
          <div id="source-selector-box">
            <a id={selectedSource === 'players' ? 'selected-source' : ''}
              name="players" onClick={handleSourceChange}>Players</a>
            <a id={selectedSource === 'purchases' ? 'selected-source' : ''}
              name="purchases" onClick={handleSourceChange}>Purchases</a>
            <a id={selectedSource === 'performance' ? 'selected-source' : ''}
              name="performance" onClick={handleSourceChange}>Performance</a>
            <a id={selectedSource === 'social' ? 'selected-source' : ''}
              name="social" onClick={handleSourceChange}>Social</a>
          </div>
          <div id="place-buttons">
            <button onClick={() => {fetchSourceData(selectedSource); fetchServerData();}}>
              <img src="/icons/circular-arrow.svg" alt="" />
            </button>
            <button>
              <img src="/icons/file-out.svg" alt="" />
            </button>
            <button>
              <img src="/icons/hamburger-menu.svg" alt="" />
            </button>
          </div>
          <LineGraph
            label={toDisplayString(selectedSource)}
            keys={selectedKeys[selectedSource] || []}
            data={sources[selectedSource]?.data || []}
          />
          <div id="metric-selector-box">
            <h2>Metrics</h2>
            {sources[selectedSource]?.keys?.length ? (
              sources[selectedSource].keys.map((key, i) => (
                <div key={i} id="metric-selector">
                  <input
                    type="checkbox"
                    checked={selectedKeys[selectedSource]?.includes(key) || false}
                    name={key}
                    onChange={handleKeyChange}
                  />
                  <label>{toDisplayString(key)}</label>
                </div>
              ))
            ) : (
              <div style={{ height: "90%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <p>No metrics available</p>
              </div>
            )}
          </div>
        </div>
        <div className="row">
          {sources[selectedSource]?.keys?.length > 0 && sources[selectedSource]?.data?.length > 0 ? (
            <div id="trend-indicators">
              {sources[selectedSource].keys.map((key, i) => (
                <TrendIndicator
                  key={i}
                  label={toDisplayString(key)}
                  past={sources[selectedSource].data[0][key]}
                  current={sources[selectedSource].data[sources[selectedSource].data.length - 1][key] || 1}
                  upIsGood={true}
                  delta={5}
                />
              ))}
            </div>
          ) : (
            <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <p>No trend data available</p>
            </div>
          )}
        </div>
        <div className="row">
          <div id="servers-box">
            <h2>Servers</h2>
            <table id="servers-table">
              <tr id="servers-header-row">
                <th>Server Name</th>
                <th>ID</th>
              </tr>
              {servers.map((server, i) => (
                <tr id="servers-row" key={i}>
                  <td>{server.name}</td>
                  <td>{parseInt(server.roblox_server_id)}</td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default Place
