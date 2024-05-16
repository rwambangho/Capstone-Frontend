import React from 'react';
import { useState, useEffect } from 'react';
import '../css/Navbar.css';
import { useNavigate } from 'react-router-dom';
import MypageIcon from "../icons/icon.svg"; // 아이콘 이미지를 import

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
          <a href="/carpool-booking" className={`nav-item ${currentPath === '/carpool-booking' ? 'active' : ''}`}>Carpool
            Booking</a>
          <a href="/carpool-recruitment-passenger"
             className={`nav-item ${currentPath.startsWith('/carpool-recruitment') ? 'active' : ''}`}>Carpool
            Recruitment</a>
          <a href="/community" className={`nav-item ${currentPath === '/community' ? 'active' : ''}`}>Community</a>

        </div>
        <div className="mypage" onClick={handleMyPageClick}>
          <button className="mypage-button">
            <img src={MypageIcon} alt="Mypage Icon" className="mypage-icon" />
            <span className="mypage-text">My Page</span>
          </button>
        </div>
      </nav>
  );
}

export default Navbar;