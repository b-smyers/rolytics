import { useNavigate } from 'react-router-dom';
import PageCrumb from '../components/PageCrumb';
import BackButton from '../components/BackButton';
import './Dashboard.css';

const Card = ({ icon, title, uri }) => {
    const navigate = useNavigate();
    const navigateURI = () => { navigate(`${uri || '/404'}`); };
  
    return (
      <button className={`card`} onClick={navigateURI}>
        <img src={icon || "/icons/missing.svg"} alt={icon} />
        <h3 id='card-title'>{title || "No title"}</h3>
      </button>
    )
  };

function Dashboard() {
    return (
    <div className='background'>
      <div id='stars'/>
      <div id="gradient">
        <div id="header">
          <div>
            <BackButton/>
            <PageCrumb/>
          </div>
          <h1>Dashboard</h1>
        </div>
      </div>
      <div id="dashboard-page">
          <Card
            key={1}
            icon={"/icons/bullet-list.svg"}
            title={"Experiences"}
            uri={"/dashboard/experiences"}
          />
          <Card
            key={2}
            icon={""}
            title={"Account"}
            uri={"/dashboard/account"}
          />
          <Card
            key={3}
            icon={"/icons/gear.svg"}
            title={"Settings"}
            uri={"/dashboard/settings"}
          />
      </div>
    </div>
  )
}

export default Dashboard;