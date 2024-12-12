import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../layouts/PageLayout';
import axios from 'axios';
import './Experiences.css';

const ExperienceCard = ({ img, title, description, uri }) => {
  const navigate = useNavigate();
  const navigateURI = () => { navigate(`/${uri || '404'}`); };

  return (
    <button className={`experience-card`} onClick={navigateURI}>
      <img src={img || "/icons/missing.svg"} alt={img} />
      <div id='experience-card-content'>
        <h3 id='experience-card-title'>{title || "No title"}</h3>
        <p id='experience-card-description'>{description || "No description"}</p>
      </div>
    </button>
  )
};

function Experiences() {
  const [experienceCards, setExperienceCards] = useState([]);

  const loadExperiences = async () => {
    try {
      const response = await axios.get('/api/v1/experiences');
      const experiences = response.data.data.experiences;
      // Image, Title, Description, Uri

      setExperienceCards(experiences);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.data) {
        console.log(error.response.data.data.message);
      } else {
        console.log('An unexpected error occurred');
      }
    }
  }

  useEffect(() => {
    loadExperiences();
  }, []);

  return (
    <PageLayout title={"Experiences"}>
      {experienceCards.map((exp, i) => (
        <ExperienceCard
          key={i}
          img={exp.img}
          title={exp.title}
          description={exp.description}
          uri={exp.uri}
        />
      ))}
      <button id='add-experience-card'>
        <img src={"/icons/plus.svg"} alt={"Connect an experience"} />
        <h3 id='experience-card-title'>Connect an Experience</h3>
      </button>
    </PageLayout>
  )
}

export default Experiences
