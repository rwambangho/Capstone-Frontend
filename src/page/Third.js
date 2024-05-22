import React from 'react';
import '../css/Third.css';
import crewImage from '../../src/image/crew.PNG';
import boardImage from '../../src/image/board.PNG';

function Third() {
  return (
    <div className="container">
      <div className="image-container">
        <img src={crewImage} alt="crew" className="crew-image" />
      </div>
      <div className="image-container">
      <img src={boardImage} alt="board" className="board-image" />
      </div>
    </div>
  );
}

export default Third;
