import React, { useState } from 'react';
import '../css/Sixth.css';

const Sixth = () => {
  const [activeIndex, setActiveIndex] = useState(null); // 현재 활성화된 아코디언 섹션 인덱스를 추적

  const onTitleClick = (index) => {
    // 이미 열려있는 섹션을 클릭하면 닫고, 그렇지 않으면 열기
    setActiveIndex(index === activeIndex ? null : index);
  };

  const questionsAndAnswers = [
    { question: '카풀 요금은 어떻게 지불하나요?', answer: '카풀 요금은 드라이버 혹은 탑승크루와 채팅을 통하여 협의하시면 됩니다. ex) 당근마켓' },
    { question: '카풀 요금은 얼마나 지불하나요?', answer: '거리에 따라 다르겠지만 보통 이동 거리의 기름값 내에서 지불하며 상호 협의하에 결정하면 됩니다. ex) 당근마켓' },
    { question: '여행 카풀 중 사고 발생 시 보험처리는 가능한가요?', answer: '무상 카풀은 시간 제한 없이 보험 보상이 가능합니다.' },
    { question: '모르는 사람과 카풀 위험하지 않을까요?', answer: 'ToCar를 사용하기 위해선 본인인증 어쩌구~' }
  ];

  return (
    <div className="main-container">
      <div className="text-container">
        <p className="text-main">자주 묻는 질문 FAQ</p>
      </div>
      <div className="accordion">
        {questionsAndAnswers.map((item, index) => (
          <React.Fragment key={index}>
            <div className={`title ${activeIndex === index ? 'active' : ''}`} onClick={() => onTitleClick(index)}>
              {item.question}
              <i className={`dropdown icon ${activeIndex === index ? 'active' : ''}`}></i>
            </div>
            <div className={`content ${activeIndex === index ? 'active' : ''}`}>
              {item.answer}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Sixth;
