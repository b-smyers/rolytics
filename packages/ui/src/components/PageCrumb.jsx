import { useNavigate } from 'react-router-dom';
import './PageCrumb.css';

const PageCrumb = () => {
    const navigate = useNavigate();
    const navigateURI = (uri) => { navigate(uri)};

    const pages = window.location.pathname.split("/").filter(Boolean);

    return (
        <div id="path-box">
        {pages.map((page, index) => {
          const currentPath = '/' + pages.slice(0, index + 1).join('/');
  
          const pageName = page.charAt(0).toUpperCase() + page.slice(1);
  
          return (
            <span key={index}>
              {index > 0 && ' > '}
              {index < pages.length - 1 ? (
                <a onClick={() => navigateURI(currentPath)} style={{ cursor: 'pointer' }}>{pageName}</a>
              ) : (
                <u>{pageName}</u>
              )}
            </span>
          );
        })}
      </div>
    );
}

export default PageCrumb;