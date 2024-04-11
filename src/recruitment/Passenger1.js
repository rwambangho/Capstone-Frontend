import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom'; 

import Navbar from '../component/Navbar';
import Sidebar from '../component/Sidebar';
import axios from 'axios';
import '../css/recruitment/Passenger1.css';
import Popup from './Popup';

function Passenger1() {


  const navigate = useNavigate();

  const [showPopup, setShowPopup] = useState(false);
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [message, setMessage] = useState('');


  const handleSubmit = async (event) => {
    event.preventDefault();

  const handleSubmit = async () => {

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
        keywords: keywords,
      });

      console.log('Response from server:', response.data);


      navigate('/carpool-booking');



    } catch (error) {
      console.error('Error saving content:', error);
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
              <form
                onSubmit={(event) => {
                  event.preventDefault(); // 기본 제출 동작 방지
                  handleSubmit(); // 커스텀 핸들러 호출
                }}
              >
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
}
export default Passenger1;
