import { useEffect } from 'react';
import './Landing.css';

function Landing() {
  useEffect(() => {
    const handleClick = (e) => {
      const ripple = document.createElement('div');
      ripple.classList.add('ripple');
      document.body.appendChild(ripple);
      
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      const x = e.clientX + scrollX; 
      const y = e.clientY + scrollY; 
      
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      setTimeout(() => {
        ripple.remove();
      }, 600); 
    };
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      <div className='background' id='radial-background'>
        <h1 className='noselect'>This website is a work in progress</h1>
      </div>
    </>
  )
}
  
export default Landing
  