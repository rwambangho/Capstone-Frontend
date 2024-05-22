// Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginModal from '../main/loginModal';
import '../css/Header.css';

const Header = () => {
  const [userId, setUserId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromCookie = getCookieValue("nickname");
    if (userIdFromCookie) {
      setUserId(userIdFromCookie);
    }
  }, []); // 빈 배열을 두 번째 인자로 전달하여 컴포넌트가 마운트될 때 한 번만 실행되도록 함

  function getCookieValue(cookieName) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split('=');
      if (cookie[0] === cookieName) {
        return cookie[1];
      }
    }
    return null;
  }

  const handleLogout = () => {
    fetch('/user/logout', {
      method: 'GET',
      credentials: 'same-origin',
    })
      .then(response => {
        if (response.ok) {
          document.cookie = "nickname=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          setUserId(null);
          navigate('/');
        } else {
          throw new Error('로그아웃에 실패했습니다.');
        }
      })
      .catch(error => {
        console.error('로그아웃 오류:', error);
      });
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <header>
      <Link to="/" className="ToCar-link">
        <h1>ToCar</h1>
      </Link>
      {userId ? (
        <div className="Header-userInfo">
          <span className="Header-userId">{userId}</span>
          <button onClick={handleLogout} className="Header-button">로그아웃</button>
        </div>
      ) : (
        <button onClick={openModal} className="Header-button">로그인 / 회원가입</button> 
      )}
      <LoginModal isOpen={modalIsOpen} closeModal={closeModal} />
    </header>
  );
};

export default Header;
