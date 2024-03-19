import React from 'react';
import '../css/Second.css';
import Header from '../component/Header';
import costImage from '../../src/image/cost.PNG';
import publicImage from '../../src/image/public.PNG';

function Second() {
  return (
    <div className="second-section">
      <div className="text-content">
        <h1 className="cost">연간 평균 주유비 305만원!</h1>
        <p>주유비 부담 없이 같은 방향 탑승크루와<br />
            편안하고 경제적으로<br />
            함께 이동해요!
        </p>
        
        <h1 className="public">대중교통 스트레스 힘드시죠?</h1>
        <p>이제 기다림 없이 바로 탑승하고<br />
            같은 방향 드라이버와<br />
            편안하게 여행 해요!
        </p>
      </div>
      <div className="image-content">
        <img src={costImage} alt="cost" className="cost-image" />
        <img src={publicImage} alt="public" className="public-image" />  
      </div>
    </div>
  );
}

export default Second;