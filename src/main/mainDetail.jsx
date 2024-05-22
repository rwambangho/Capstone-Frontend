import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


function MainDetail() {
  const [typedText, setTypedText] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const text = "시간은 없는데 택시비는 더 없으신가요?";
    let index = 0;

    const typingInterval = setInterval(() => {
      if (index <= text.length) {
        setTypedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => {
      clearInterval(typingInterval);
    };
  }, []);

  const handleScrollDown = () => {
    navigate('/mainDetail2');
  };

  
  


  // 페이지를 위로 이동하는 함수
  const scrollToTop = () => {
    navigate('/');
  };



  return (
    <div className="home-background">
      <div className="title-container">
      <h1 className="typing-animation">{typedText}</h1>
      </div>
      <div className='icon-up'>
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="#ffffff" className="bi bi-chevron-double-up animated-icon" viewBox="0 0 16 16" onClick={scrollToTop}>
        <path fillRule="evenodd" d="M7.646 2.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 3.707 2.354 9.354a.5.5 0 1 1-.708-.708z"/>
        <path fillRule="evenodd" d="M7.646 6.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 7.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
      </svg>
      </div>
        
      <div className="icon-down" onClick={handleScrollDown}>
      
         더 알아보기
         <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="#ffffff" class="bi bi-chevron-double-down" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
  <path fill-rule="evenodd" d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
</svg>
     
      </div>
    </div>
  );
}

export default MainDetail;
