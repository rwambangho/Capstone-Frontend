import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import  {useNavigate}  from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/main/modal.css';

const SignUpModal = ({ isOpen, closeModal }) => {

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

  const [verificationButtonText, setVerificationButtonText] = useState('Send Verification Code');
  const [remainingTime, setRemainingTime] = useState(null); // 남은 시간 상태 추가
  const [idAvailable, setIdAvailable] = useState(false); 
  const [idVerification,setVertificasionId]=useState("cheack Availability");
  const navigate=useNavigate();
  let timer; // 타이머 변수 추가

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
      await axios.post('/user/sendSMS', { phoneNumber: formData.phoneNumber });
      alert('인증번호가 전송되었습니다!');
      startTimer();
    } catch (error) {
      console.error('Error sending verification code:', error);
    }
  };

  const checkIdAvailability = async () => {
    try {
      const response = await axios.get(`/user/checkId?id=${formData.id}`);
      setIdAvailable(response.data);
      if (!response.data) {
        alert('사용할 수 없는 아이디입니다.');
      }
      else{
        setVertificasionId("checked");
      }
    } catch (error) {
      console.error('Error checking id availability:', error);
    }
  };


  const verifyCode = async () => {
    if (!remainingTime) {
      alert('인증시간이 초과되었습니다. 재발송 해주세요.');
      return;
    }

    try {
      const response = await axios.post('/user/sendSMS/check', {
        phoneNumber: formData.phoneNumber,
        verificationCode: formData.verificationCode,
      });
      if (response.data) {
        setFormData({
          ...formData,
          isVerified: true
        });
        alert('인증되었습니다.');
      } else {
        alert('인증에 실패하였습니다.');
      }
    } catch (error) {
      console.error('Verification error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.isVerified) {
      alert('핸드폰 번호 인증을 완료해주세요.');
      return;
    }
    if(!idAvailable){
      alert("아이디 중복체크를 완료해주세요");
      return;
    }
    try {
      const response = await axios.post('/user/signUp', formData);

      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.error('Error signing up:', error);
      alert("회원가입 실패!");
    }
  };

  const startTimer = () => {
    setVerificationButtonText('Resend');
    const duration = 3 * 60 * 1000; // 3분을 밀리초로 계산
    const endTime = Date.now() + duration;

    timer = setInterval(() => {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        clearInterval(timer);
        setRemainingTime(null);
        setVerificationButtonText('Send Verification Code');
      } else {
        const minutes = Math.floor(remaining / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        setRemainingTime(`${minutes}m ${seconds}s`);
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      clearInterval(timer); // 컴포넌트가 언마운트될 때 타이머 정리
    };
  }, []);

  return (
    <Modal
      className="signUpModal"
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Login/Signup Modal"
      overlayClassName="modalOverlay"
    >
      <div>
        <button className="closeButton" onClick={closeModal}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
          </svg>
        </button>
        <div className="signup-container">
          <div className="signup-form">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input type="email" name="id" required placeholder="Your email (ID)" value={formData.id} onChange={handleChange} />
                <button type="button" className='checkIdButton' onClick={checkIdAvailability}>{idVerification}</button>
              </div>
              {!idAvailable && <p>This ID is not available. Please choose another one.</p>}
              <div className="input-group">
                <input type="password" name="password" required placeholder="Password" value={formData.password} onChange={handleChange} />
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
                <button type="button" className="sendVerificationButton" onClick={sendVerificationCode}>{verificationButtonText}</button>
              </div>
              <div className="input-group">
                <input type="text" name="verificationCode" required placeholder={remainingTime || "Verification Code"} value={formData.verificationCode} onChange={handleChange} />
                <button type="button" className="verifyCodeButton" onClick={verifyCode}>Verify Code</button>
              </div>
              <button className="signUpButton" type="submit">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SignUpModal;
