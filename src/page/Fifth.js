import React from 'react';
import '../css/Fifth.css';
import stepImage from '../../src/image/step.PNG';

function Fifth() {
  return (
    <div className="main-container">
      <div className="text-container">
        <p className="text-main">ToCar 이용방법</p>
      </div>
      <img src={stepImage} alt="step" className="step-image" />
    </div>
  );
}

export default Fifth;
