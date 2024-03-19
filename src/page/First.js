import React from 'react';
import '../css/First.css';
import Header from '../component/Header';
import logoImage from '../../src/image/logo.PNG';

const First = () => {
  return (
    <div className="First">
      <div className="First-description">
        여행자들을 위한 카풀 매칭 커뮤니티
      </div>
      <img src={logoImage} alt="Logo" className="First-image" />
    </div>
  );
};

export default First;
