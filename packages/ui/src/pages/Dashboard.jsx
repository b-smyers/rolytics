import { useNavigate } from 'react-router-dom';
import PageLayout from '../layouts/PageLayout';
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
      <PageLayout title={"Dashboard"}>
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
      </PageLayout>
  )
}

export default Dashboard;