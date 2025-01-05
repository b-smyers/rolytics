import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; 
import './PageCrumb.css';

const PageCrumb = () => {
    const navigate = useNavigate();
    const navigateURI = (uri) => { navigate(uri) };

    let pages = window.location.pathname.split("/").filter(Boolean).map(decodeURIComponent);

    const links = pages.map((page, index) => {
      return '/' + pages.slice(0, pages.length - (pages.length - index)).join('/');
    });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const mediaQuery = window.matchMedia("(max-width: 750px)");
      const handleMediaChange = (e) => setIsMobile(e.matches);
      mediaQuery.addEventListener("change", handleMediaChange);
  
      setIsMobile(mediaQuery.matches);
  
      return () => mediaQuery.removeEventListener("change", handleMediaChange);
    }, []);

    return (
        <div id="path-box">
        {pages.map((page, index) => {
          // Show max two crumbs on mobile
          if (isMobile && index < pages.length - 2) { return; }

          const pageName = page.charAt(0).toUpperCase() + page.slice(1);
  
          return (
            <span key={index}>
              {index > 0 && (isMobile ? index > pages.length - 2 : true) && ' > '}
              {index < pages.length - 1 ? (
                <a onClick={() => navigateURI(links[index + 1])} style={{ cursor: 'pointer' }}>{pageName}</a>
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