import React from 'react';
import '../css/Navbar.css';

function Navbar() {
  
  return (
    <nav className="navbar">
      <div className="logo">ToCar</div>
      <div className="nav-links">
        <a href="/carpool-booking" className="nav-item">Carpool Booking</a>
        <a href="/carpool-recruitment" className="nav-item">Carpool Recruitment</a>
        <a href="/community" className="nav-item active">Community</a>
      </div>
      <div className="mypage">
        <button>My Page</button>
      </div>
    </nav>
  );
}

export default Navbar;