import { useNavigate } from 'react-router-dom';
import './BackButton.css';

const BackButton = () => {
    const navigate = useNavigate();
    const navigateBack = () => { navigate(-1) };

    return (
        <button id="back-button" onClick={navigateBack}>
          <img src="/icons/left-arrow.svg" alt="Go back" />
        </button>
    );
}

export default BackButton;