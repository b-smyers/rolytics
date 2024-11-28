import './PageCrumb.css';

// Example: '/dashboard/experiences/servers'
const PageCrumb = ({ uri }) => {
    const pages = uri.split("/").filter(Boolean);
    let currentPath = '';

    return (
        <div id="path-box">
        {pages.map((page, index) => {
          currentPath += `/${page}`;
  
          const pageName = page.charAt(0).toUpperCase() + page.slice(1);
  
          return (
            <span key={index}>
              {index > 0 && ' > '}
              {index < pages.length - 1 ? (
                <a href={currentPath}>{pageName}</a>
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