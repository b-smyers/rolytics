import PageCrumb from '../components/PageCrumb';
import BackButton from '../components/BackButton';
import './PageLayout.css';

function PageLayout({ title, children }) {
    return (
        <div className='background'>
        <div id='stars'/>
        <div id="gradient">
          <div id="header">
            <div>
              <BackButton/>
              <PageCrumb/>
            </div>
            <h1>{title || "Missing Title"}</h1>
          </div>
        </div>
        <div id="page">
            {children}
        </div>
      </div>
    );
}

export default PageLayout;