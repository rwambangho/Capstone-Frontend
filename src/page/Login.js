//Login.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // axios import 추가
//import Header from '../component/Header';
import '../css/Login.css';
import chairImage from '../../src/image/chair.PNG';

const Login = () => {
  const [id, setId] = useState(''); // 이메일 상태 추가
  const [password, setPassword] = useState(''); // 비밀번호 상태 추가

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
  
    try {
      const response = await axios.post('/user/login', {
        id: id,
        password: password
      });
      
      console.log(response.data); // 서버에서 받은 응답 확인
      // 로그인 성공 시 필요한 작업 수행
    } catch (error) {
      console.error('Error logging in:', error); // 로그인 오류 시 오류 메시지 출력
      // 로그인 실패 시 필요한 작업 수행
    }
  };

  return (
    <div>
      {/* <Header /> */}
    <div className="login-container">
      <div className="login-form">
        <h2>Log In</h2>
        <form onSubmit={handleSubmit}> {/* 폼 제출 이벤트 핸들러 추가 */}
          <div className="input-group">
            <input type="text" id="id" required placeholder="Your email" value={id} onChange={(e) => setId(e.target.value)} />
          </div>
          <div className="input-group">
            <input type="password" id="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit">Log In</button>
          <a href="/forgot">Forgot password?</a>
          <div className="separator">or</div>
          <button type="button" className="kakao-login">카카오톡</button>
        </form>
        <div className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
      <div className="login-image">
        <img src={chairImage} alt="chair" className="chair-image" />
      </div>
    </div>
    </div>
  );
};

export default Login;