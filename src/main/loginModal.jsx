import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios'; // axios import 추가
import SignUpModal from '../main/signupModal'; // SignUpModal import 추가
import '../css/main/modal.css';

const LoginModal = ({ isOpen, closeModal }) => {
  const [id, setId] = useState(''); // 이메일 상태 추가
  const [password, setPassword] = useState(''); // 비밀번호 상태 추가
  const [showSignUpModal, setShowSignUpModal] = useState(false); // SignUpModal을 열기 위한 상태 추가

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
  
    try {
      const response = await axios.post('/user/login', {
        id: id,
        password: password
      });
      
      document.cookie='id=' + response.data.id + '; path=/';
      document.cookie = `nickname=${response.data.nickname}; path=/`;
    
      console.log(response.data); // 서버에서 받은 응답 확인
      window.location.href = '/';
    
    } catch (error) {
      console.error('Error logging in:', error); // 로그인 오류 시 오류 메시지 출력
      alert("아이디,비밀번호가 틀립니다.");
    }
  };

  
  // SignUp 모달로 전환하는 함수
  const switchToSignUp = () => {
    closeModal(); // Login 모달 닫기
    setShowSignUpModal(true); // SignUp 모달 열기
  };

  return (
    <>
      <Modal
        className="loginModal"
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Login/Signup Modal"
        overlayClassName="modalOverlay"
      >
        <div>
          <h2>Login</h2>
          {/* Login 폼 */}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input type="text" id="id" required placeholder="Your email" value={id} onChange={(e) => setId(e.target.value)} />
            </div>
            <div className="input-group">
              <input type="password" id="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit">Log In</button>
          </form>
        

          {/* SignUp 모달로 전환하는 버튼 */}
          <button className="signupButton" onClick={switchToSignUp}>SignUp</button>
        </div>
        <button className="closeButton" onClick={closeModal}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
          </svg>
        </button>
      </Modal>
      {/* SignUp 모달 */}
      <SignUpModal isOpen={showSignUpModal} closeModal={() => setShowSignUpModal(false)} />
    </>
  );
};

export default LoginModal;
