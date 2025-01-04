import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import LineGraph from '../components/LineGraph';
import TrendIndicator from '../components/TrendIndicator';
import PageLayout from '../layouts/PageLayout';
import axios from 'axios';
import './Experience.css';

async function experienceExists(title) {
  let exists = false;

  try {
    const response = await axios.get('/api/v1/experiences');
    const experiences = response.data.data.experiences;
    
    exists = experiences.some(experience => experience.name === title);
  } catch (error) {
    if (error.response && error.response.data && error.response.data.data) {
      console.log(error.response.data.data.message);
    } else {
      console.log('An unexpected error occurred:', error.status);
    }
  }
  return exists;
}

// const data = {
//   analytics: {
//     keys: ["retention", "engagement", "gameplay"],
//     data: [
//       { time: '-2:00', retention: 1, engagement: 0, gameplay: 9},
//       { time: '-1:45', retention: 2, engagement: 0, gameplay: 7},
//       { time: '-1:30', retention: 1, engagement: 0, gameplay: 4},
//       { time: '-1:15', retention: 3, engagement: 1, gameplay: 7},
//       { time: '-1:00', retention: 1, engagement: 1, gameplay: 4},
//       { time: '-0:45', retention: 3, engagement: 0, gameplay: 5},
//       { time: '-0:30', retention: 6, engagement: 0, gameplay: 2},
//       { time: '-0:15', retention: 4, engagement: 0, gameplay: 1},
//       { time: '0:00', retention: 5, engagement: 1, gameplay: 0}
//     ]
//   },
// };

// const places = [
//   { name: "Place 1", age: "2:00" },
//   { name: "Place 2", age: "1:45" },
//   { name: "Place 3", age: "1:30" }
// ];

function toDisplayString(key = "Missing") {
  return key.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function Experience() {
  const navigate = useNavigate();

  const [sources, setSources] = useState({
    players: { keys: [], data: [] },
    purchases: { keys: [], data: [] },
    analytics: { keys: [], data: [] },
    performance: { keys: [], data: [] },
    social: { keys: [], data: [] }
  });

  const [places, setPlaces] = useState([]);

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

  const { title } = useParams();
  const location = useLocation();
  const { experience_id } = location.state || {};

  const checkExperience = useCallback(async () => {
    // redirect to experiences page if experience does not exist
    if (!(await experienceExists(title))) {
      navigate('/dashboard/experiences');
    }
  }, [title, navigate]);

  const fetchSourceData = async (source) => {
    // Load data from initally selected source
    // All other data will be loaded ONCE when the source is changed (further updates will be updated from the refresh button)
    // Get analytics data
    try {
      const response = await axios.get(`/api/v1/experiences/${source}?experience_id=${experience_id}`);
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

  const fetchPlaceData = async () => {
    // Get place data
    try {
      const response = await axios.get(`/api/v1/places?experience_id=${experience_id}`);
      const { places: responsePlaces } = response.data.data;

      setPlaces(responsePlaces);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.data) {
        console.log(error.response.data.data.message);
      } else {
        console.log('An error occurred getting place data:', error.status);
      }
    }
  };

  useEffect(() => {
    checkExperience();
    fetchSourceData(selectedSource);
    fetchPlaceData();
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
    <PageLayout title={title}>
      <div id='experience-page'>
        <div className='row'>
          <div id="source-selector-box">
            <a id={selectedSource === 'players' ? 'selected-source' : ''}
              name="players" onClick={handleSourceChange}>Players</a>
            <a id={selectedSource === 'purchases' ? 'selected-source' : ''}
              name="purchases" onClick={handleSourceChange}>Purchases</a>
            <a id={selectedSource === 'analytics' ? 'selected-source' : ''}
              name="analytics"  onClick={handleSourceChange}>Analytics</a>
            <a id={selectedSource === 'performance' ? 'selected-source' : ''}
              name="performance" onClick={handleSourceChange}>Performance</a>
            <a id={selectedSource === 'social' ? 'selected-source' : ''}
              name="social" onClick={handleSourceChange}>Social</a>
          </div>
          <div id="experience-buttons">
            <button onClick={() => {fetchSourceData(selectedSource); fetchPlaceData();}}>
              <img src="/icons/circular-arrow.svg" alt="" />
            </button>
            <button>
              <img src="/icons/file-out.svg" alt="" />
            </button>
            <button>
              <img src="/icons/hamburger-menu.svg" alt="" />
            </button>
          </div>
        </div>
        <div className="row">
          <div style={{ flex: 7 }}>
            <LineGraph
              label={toDisplayString(selectedSource)}
              keys={selectedKeys[selectedSource] || []}
              data={sources[selectedSource]?.data || []}
            />
          </div>
          <div id="metric-selector-box" style={{ flex: 2 }}>
            <h2>Metrics</h2>
            {sources[selectedSource]?.keys?.length ? (
              sources[selectedSource].keys.map((key, i) => (
                <div key={i} className="metric-selector">
                  <input
                    type="checkbox"
                    checked={selectedKeys[selectedSource]?.includes(key) || false}
                    name={key}
                    onChange={handleKeyChange}
                  />
                  <label id="metric-label">{toDisplayString(key)}</label>
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
                  past={sources[selectedSource].data[0][key]} // Use the 2nd newest point, oldest point, or average based on your TODO decision
                  current={sources[selectedSource].data[sources[selectedSource].data.length - 1][key]}
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
          <div id="places-box">
            <h2>Places</h2>
            <table id="places-table">
              <tr>
                <th>Place Name</th>
                <th>ID</th>
              </tr>
              {places.map((place, i) => (
                <tr key={i}>
                  <td>{place.name}</td>
                  <td>{parseInt(place.roblox_place_id)}</td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default Experience
