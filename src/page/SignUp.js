import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import '../css/SignUp.css';
import chairImage from '../../src/image/chair.PNG';

const SignUp = () => {
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    repeatPassword: '',
    name: '',
    birthdate: new Date(),
    nickname: '',
    phoneNumber: '',
    verificationCode: '',
    isVerified: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      birthdate: date
    });
  };

   const sendVerificationCode = async () => {
     try {
       const response = await axios.post('/user/sendSMS', { phoneNumber: formData.phoneNumber });
       alert('검증 코드가 발송되었습니다!');
     } catch (error) {
       console.error('검증 코드 발송 오류:', error);
     }
   };

   const verifyCode = async () => {
     try {
       const response = await axios.post('/user/sendSMS/check', {
         phoneNumber: formData.phoneNumber,
         verificationCode: formData.verificationCode,
       });
       if (response.data) {
         
         alert('전화번호가 검증되었습니다!');
       } else {
         alert('검증 실패. 코드를 확인하고 다시 시도해주세요.');
       }
     } catch (error) {
       console.error('코드 검증 오류:', error);
     }
   };


  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    try {
      const response = await axios.post('/user/signUp', formData);

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
            <input type="email" name="id" required placeholder="Your email (ID)" value={formData.id} onChange={handleChange} />
          </div>
          <div className="input-group">
            <input type="password" name="password" required placeholder="Password" value={formData.password} onChange={handleChange} />
          </div>
          <div className="input-group">
            <input type="password" name="repeatPassword" required placeholder="Repeat Password" value={formData.repeatPassword} onChange={handleChange} />
          </div>
          <div className="input-group">
            <input type="text" name="name" required placeholder="Your name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="input-group">
            <DatePicker
              selected={formData.birthdate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              placeholderText="Your birthdate"
              customInput={<input type="text" />}
            />
          </div>
          <div className="input-group">
            <input type="text" name="nickname" required placeholder="Your nickname" value={formData.nickname} onChange={handleChange} />
          </div>
          <div className="input-group">
            <input type="tel" name="phoneNumber" required placeholder="Your phone number" value={formData.phoneNumber} onChange={handleChange} />
            <button type="button" onClick={sendVerificationCode}>Send Verification Code</button>
          </div>
          <div className="input-group">
            <input type="text" name="verificationCode" required placeholder="Verification Code" value={formData.verificationCode} onChange={handleChange} />
            <button type="button" onClick={verifyCode}>Verify Code</button>
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