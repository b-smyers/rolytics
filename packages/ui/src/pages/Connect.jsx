import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../layouts/PageLayout';
import axios from 'axios';
import './Connect.css';

function Connect() { 
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pageLink, setPageLink] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [experienceId, setExperienceId] = useState('');
  const [thumbnailLink, setThumbnailLink] = useState('/icons/missing.svg');
  const [isFormValid, setIsFormValid] = useState(false);

  async function updateAutofill(link) {
    setPageLink(link || "");
    if (!link) { return; }

    const id = link.match(/(?<=roblox\.com\/games\/)[0-9]+/);

    if (!id || !id[0]) { setIsFormValid(false); setPlaceId(''); setExperienceId(''); setName(''); setDescription(''); setThumbnailLink('/icons/missing.svg'); return; }
    if (id[0] == placeId) { return; } // Avoid uneccessary requests
    setPlaceId(id[0]);

    try {
      const response = await axios.post('/api/v1/roblox/place-details', {
        placeId: id[0]
      });
      const data = response.data.data;

      setThumbnailLink(data.thumbnails[0] || '/icons/missing.svg');
      setName(data.name || "Game Not Found");
      setDescription(data.description || "No description available.");
      setExperienceId(data.experienceId || "");

      setIsFormValid(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.data) {
        console.log(error.response.data.data.message);
      } else {
        console.log('An unexpected error occurred');
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/v1/experiences/connect', {
        page_link: pageLink, 
        roblox_place_id: placeId,
        roblox_experience_id: experienceId,
        thumbnail_link: thumbnailLink,
        name: name,
        description: description
      });

      if (response.status === 200) {
        console.log(response.data.data.message);
      }
      navigate('/dashboard/experiences');
} catch (error) {
      if (error.response && error.response.data && error.response.data.data) {
        console.log(error.response.data.data.message);
      } else {
        console.log('An unexpected error occurred');
      }
    }
  };


  return (
    <PageLayout title={"Connect"}>
      <form id='connect-form' onSubmit={handleSubmit}>
        <div className='connect-entry'>
          <h2>1. Link</h2>
          <input
            type="url"
            name="page-link"
            id="page-link"
            placeholder="https://roblox.com/XXXXXX"
            value={pageLink}
            onChange={(e) => updateAutofill(e.target.value) }
            required
          />
        </div>
        <div className='connect-entry'>
          <h2>Place ID</h2>
          <input
            type="text"
            name="place-id"
            id="place-id"
            placeholder="Place ID"
            value={placeId}
            onChange={(e) => setPlaceId(e.target.value)}
            disabled
          />
        </div>
        <div className='connect-entry'>
          <h2>Experience ID</h2>
          <input
            type="text"
            name="experience-id"
            id="experience-id"
            placeholder="Experience ID"
            value={experienceId}
            onChange={(e) => setExperienceId(e.target.value)}
            disabled
          />
        </div>
        <div className='connect-entry'>
          <button id="connect-button" type="submit" disabled={!isFormValid}>Connect Experience</button>
        </div>
      </form>
      <div id='preview-box'>
        <h2>Thumbnail</h2>
        <div id='thumbnail-box'>
          <img src={thumbnailLink} />
        </div>
        <div id='title-box'>
          <h2>{name}</h2>
          <a href={pageLink}>Game Page</a>
        </div>
        <p>{description ? description : <small>No description</small>}</p>
      </div>
    </PageLayout>
  )
}

export default Connect
