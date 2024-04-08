//Passenger1.js
import React, { useState } from 'react';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
=======
import { useNavigate } from 'react-router-dom';
>>>>>>> 80e5c59 (.)
import Navbar from '../component/Navbar';
import Sidebar from '../component/Sidebar';
import axios from 'axios';
import '../css/recruitment/Passenger1.css';
import Popup from './Popup';

function Passenger1() {
<<<<<<< HEAD
  const navigate = useNavigate(); // useNavigate 추가
=======
  const navigate = useNavigate();
>>>>>>> 80e5c59 (.)
  const [showPopup, setShowPopup] = useState(false);
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [message, setMessage] = useState('');

<<<<<<< HEAD
  const handleSubmit = async (event) => {
    event.preventDefault();

=======
  const handleSubmit = async () => {
>>>>>>> 80e5c59 (.)
    try {
      const response = await axios.post('/recruits', {
        title: 'Passenger Post',
        contents: `${departure} to ${destination} at ${date} ${time}`,
        username: 'User',
        destination: destination,
        departureDate: date,
        departureLatitude: 0,
        departureLongitude: 0,
        isDriverPost: false,
<<<<<<< HEAD
=======
        keywords: keywords,
>>>>>>> 80e5c59 (.)
      });

      console.log('Response from server:', response.data);

      // 등록 후 Booking 페이지로 이동
<<<<<<< HEAD
      navigate('/carpool-booking'); // navigate 함수를 사용하여 Booking 페이지로 이동

      // 서버로부터 응답을 받아온 후 필요한 작업 수행
      // 예를 들어, Booking.js 파일에서 데이터를 가져와서 표시할 수 있음
=======
      navigate('/carpool-booking');

>>>>>>> 80e5c59 (.)
    } catch (error) {
      console.error('Error saving content:', error);
      // 에러 처리
    }
  };

  const handleKeywordChange = (event) => {
    if (event.key === 'Enter' && event.target.value.trim() !== '') {
      setKeywords([...keywords, event.target.value]);
      event.target.value = '';
    }
  };

  const removeKeyword = (index) => {
    setKeywords(keywords.filter((_, idx) => idx !== index));
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  }

  return (
    <div className="page-container">
      <Navbar />
      <div className="main-content" style={{ display: 'flex' }}>
        <Sidebar />
        <div className="right-content">
          <div className="post-form-header">
            <h1>Select the right post for you!</h1>
            <div className="post-buttons">
              <button className="passenger-post-btn">Passenger's post</button>
              <button className="driver-post-btn" onClick={togglePopup}>Driver's post</button>
            </div>
          </div>
          <div className="form-container">
            <div className="form-title">
              <h2>Write as a passenger</h2>
              <hr />
<<<<<<< HEAD
              <form onSubmit={handleSubmit}>
=======
              <form
                onSubmit={(event) => {
                  event.preventDefault(); // 기본 제출 동작 방지
                  handleSubmit(); // 커스텀 핸들러 호출
                }}
              >
>>>>>>> 80e5c59 (.)
                <div className="input-group">
                  <label>Point of Departure</label>
                  <input
                    type="text"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    placeholder="fill in your point of departure"
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Destination</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="fill in your Destination"
                    required
                  />
                </div>
                <div className="input-group date-time">
                  <div className="date-input-container">
                    <label>Date and time of departure</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="time-input-container">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>keywords</label>
                  <div className="keywords">
                    {keywords.map((keyword, index) => (
                      <div className="keyword" key={index}>
                        {keyword}
                        <button type="button" onClick={() => removeKeyword(index)}>×</button>
                      </div>
                    ))}
                    <input
                      type="text"
                      onKeyDown={handleKeywordChange}
                      placeholder="Push the 'Enter' button and add keywords"
                    />
                  </div>
                </div>
                <div className="input-group message-container">
                  <label>what you want to tell</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="메시지를 입력하세요."
                    required
                  />
                </div>
                {showPopup && <Popup onClose={togglePopup} />}
                <button type="submit">Register</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Passenger1;