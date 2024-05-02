import React from 'react';
import { useState, useEffect } from 'react';
import '../css/Navbar.css';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const navigate = useNavigate();

  useEffect(() => {
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePathChange);

    return () => {
      window.removeEventListener('popstate', handlePathChange);
    };
  }, []);

  const handleMyPageClick = () => {
    navigate('/mypage');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={handleLogoClick}>ToCar</div>
      <div className="nav-links">
        <a href="/carpool-booking" className={`nav-item ${currentPath === '/carpool-booking' ? 'active' : ''}`}>Carpool Booking</a>
        <a href="/carpool-recruitment" className={`nav-item ${currentPath === '/carpool-recruitment' ? 'active' : ''}`}>Carpool Recruitment</a>
        <a href="/community" className={`nav-item ${currentPath === '/community' ? 'active' : ''}`}>Community</a>
        
      </div>
      <div className="mypage">
        <button onClick={handleMyPageClick}>My Page</button>
      </div>
    </nav>
  );
}

export default Navbar;
