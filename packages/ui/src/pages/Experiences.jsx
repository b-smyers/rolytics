import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageCrumb from '../components/PageCrumb';
import axios from 'axios';
import './Experiences.css';

const ExperienceCard = ({ title, img, uri }) => {
  const navigate = useNavigate();
  const navigateURI = () => { navigate(`/${uri}`); };

  return (
    <button className={`experience-card`} onClick={navigateURI}>
      <img src={img || "/logos/rolytics.svg"} alt={img} />
      <div id='experience-card-content'>
        <h3 id='experience-card-title'>{title}</h3>
        <p id='experience-card-description'>Brief experience description will be put here automatically. Lorem ipsum doler sit amet</p>
      </div>
    </button>
  )
};

function Experiences() {
  const [experienceCards, setExperienceCards] = useState([]);

  const loadExperiences = async () => {
    try {
      // const response = await axios.get('/api/v1/experiences');
      // const experiences = response.data.data.experiences;
      const experiences = [
        { id: 1, title: "game1", uri: "dashboard/experiences/game1"},
        { id: 2, title: "game2", uri: "dashboard/experiences/game2"},
        { id: 3, title: "game3", uri: "dashboard/experiences/game3"},
        { id: 4, title: "game4", uri: "dashboard/experiences/game4"}
      ];
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
    <div className='background'>
      <div id='stars'/>
      <div id="gradient">
        <div id="header">
          <PageCrumb uri={'/dashboard/experiences'}/>
          <h1>Experiences</h1>
        </div>
      </div>
      <div id="experiences-page">
        {experienceCards.map((exp) => (
          <ExperienceCard
            key={exp.id}
            img={exp.img}
            title={exp.title}
            uri={exp.uri}
          />
        ))}
        <button id='add-experience-card'>
          <img src={"/icons/plus.png"} alt={"Connect an experience"} />
          <h3 id='experience-card-title'>Connect an Experience</h3>
        </button>
      </div>
    </div>
  )
}

export default Experiences
