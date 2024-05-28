import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../component/Header';
import '../css/main/main.css';

function Main() {
  const [typedText, setTypedText] = useState('');
  const [typedText2, setTypedText2] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const text = "카풀 매칭 커뮤니티";
    const text2 = "Tocar";
    let index = 0;

    const typingInterval = setInterval(() => {
      if (index <= text.length) {
        setTypedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    const typingInterval2 = setInterval(() => {
      if (index <= text2.length) {
        setTypedText2(text2.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval2);
      }
    }, 100);

    return () => {
      clearInterval(typingInterval);
      clearInterval(typingInterval2);
    };
  }, []);

  const handleScrollDown = () => {
    navigate('/mainDetail');
  };

  const handleIconRightClick = () => {
    navigate('/carpool-booking');
  };

  return (
      <div className={`home-background ${location.pathname === '/jejudo2' ? 'slide-out' : ''}`}>
        <Header />
        <div className="title-container">
          <h1 className="typing-animation">{typedText}</h1>
          <h1 className='typing-animation2'>{typedText2}</h1>
        </div>

        <div className="icon-down" onClick={handleScrollDown}>
          더 알아보기
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="#ffffff" className="bi bi-chevron-double-down" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
            <path fillRule="evenodd" d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
          </svg>
        </div>
        <div className="icon-right" onClick={handleIconRightClick}>
          카풀 예약하러 가기
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="#ffffff" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708"/>
            <path fillRule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708"/>
          </svg>
        </div>
      </div>
  );
}

export default Main;
