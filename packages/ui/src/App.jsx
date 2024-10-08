import './App.css'
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const handleClick = (e) => {
      const ripple = document.createElement('div');
      ripple.classList.add('ripple');
      document.body.appendChild(ripple);
      const x = e.clientX;
      const y = e.clientY;
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
      <div className='background'>
        <h1 className='noselect'>Rolytics</h1>
      </div>
    </>
  )
}

export default App
