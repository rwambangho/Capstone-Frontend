// jejudo2.js
import React from 'react';
import Navbar from '../component/Navbar';
import '../css/main/jejudo2.css';

function Jejudo2() {
  return (
    <div className="home-background">
      <Navbar />
      <div className="content">
        <h1 className="title">JEJUDO</h1>
        <div className="description-box">
          <p>Nestled off the southern coast of South Korea lies a hidden gem awaiting discovery – Jeju Island. As an avid traveler seeking new adventures, I recently embarked on a journey to this picturesque island, eager to explore its natural wonders and cultural treasures...</p>
        </div>
      </div>
    </div>
  );
}

export default Jejudo2;