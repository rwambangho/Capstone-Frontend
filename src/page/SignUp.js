import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import '../css/SignUp.css';
import chairImage from '../../src/image/chair.PNG';

const SignUp = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    
    try {
      const response = await axios.post('/user/signUp', {
        id: id,
        password: password,
        repeatPassword: repeatPassword
      });

      console.log(response.data); // 서버에서 받은 응답 확인
      // Sign up 성공 시 필요한 작업 수행
    } catch (error) {
      console.error('Error signing up:', error);
      // Sign up 실패 시 필요한 작업 수행
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-image">
        <img src={chairImage} alt="chair" className="chair-image" />
      </div>
      <div className="signup-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="email" id="email" required placeholder="Your email" value={id} onChange={(e) => setId(e.target.value)} />
          </div>
          <div className="input-group">
            <input type="password" id="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="input-group">
            <input type="password" id="repeat-password" required placeholder="Repeat Password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
          </div>
          <button type="submit">Sign Up</button>
          <div className="separator">or</div>
          <button type="button" className="kakao-login">카카오톡</button>
        </form>
        <div className="signup-link">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;