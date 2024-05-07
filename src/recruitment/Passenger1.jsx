import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';
import Sidebar from '../component/Sidebar';
import axios from 'axios';



function Passenger1() {
  const navigate = useNavigate();
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState(getCookieValue('id') || 'User');
  const [departureCoords, setDepartureCoords] = useState({ latitude: 0, longitude: 0 });
  const [destinationCoords, setDestinationCoords] = useState({ latitude: 0, longitude: 0 });


  useEffect(() => {
    const usernameFromCookie = getCookieValue('id');
    if (usernameFromCookie) {
      setUsername(usernameFromCookie);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/recruits', {
        title: 'Passenger Post',
        contents: `${departure} to ${destination} at ${date} ${time}`,
        username: username,
        departure: departure,
        destination: destination,
        departureDate: date,
        departureLatitude: departureCoords.latitude,
        departureLongitude: departureCoords.longitude,
        destinationLatitude: destinationCoords.latitude,
        destinationLongitude: destinationCoords.longitude,
        isDriverPost: false,
        keywords: keywords,
        message : message
      });

      console.log('Response from server:', response.data);

      navigate('/carpool-booking');
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

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

  const handleKeywordChange = (event) => {
    if (event.key === 'Enter' && event.target.value.trim() !== '') {
      setKeywords([...keywords, event.target.value]);
      event.target.value = '';
    }
  };

  const removeKeyword = (index) => {
    setKeywords(keywords.filter((_, idx) => idx !== index));
  };


  return (
      <div className="page-container">
        <style>
          {`
          .main-content {
    display: flex;
    background-color: #f9f9f9;
}

.form-title {
    text-align: left;
    padding-bottom: 10px;
}

.form-title h2 {
    margin: 0;
    padding-bottom: 5px;

}

.form-title hr {
    border: none;
    border-top: 1px solid #ccc; /* 얇은 선 추가 */
    margin-bottom: 30px;

}

.input-group label {
    display: block;
    margin-bottom: 5px;
    text-align: left;
}

.form-container {
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
    margin-bottom: 20px;
    padding: 100px;
}

.right-content {
    flex-grow: 1; /* 남은 공간을 모두 채우도록 설정 */
    padding: 20px;
    max-width: calc(100% - 250px); /* 사이드바 너비를 제외한 최대 너비 */
    margin-right: 250px;
    box-sizing: border-box;
}

.right-content h1 {
    /* ... */
}

.post-form-header {
    text-align: center;
    margin-bottom: 20px;
}

.content-container {
    max-width: 100%;
    margin: 0 auto;
}

.content-container h1 {
    text-align: center;
    margin-top: 20px;
}

.post-buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 50px;
    margin-top: 50px;/*위의 select 어쩌구랑 여백 추가*/
}

.input-group-text {
    margin-bottom: 15px;
    border-radius: 10px;
}

.input-group input,
.input-group textarea {
    background-color: #f0f0f0; /* 입력 필드 배경색을 회색으로 설정 */
    border-radius: 5px;
    border: 1px solid #ccc; /* 테두리 색상 설정 */
    padding: 10px;
    width: 100%; /* 폭을 전체로 설정 */
}

.date-time-container {
    display: flex; /* 날짜와 시간 입력 필드를 가로로 배치 */
    justify-content: space-between; /* 필드 사이에 공간을 분배 */
    margin-bottom: 20px;
}

.date-input-container,
.time-input-container {
    flex: 1; /* 사용 가능한 공간을 균등하게 차지 */
    margin-right: 10px; /* 우측 여백 */
}


.time-input-container {
    margin-right: 0;
}

.message-container textarea {
    height: 120px; /* 메시지 입력란의 높이 고정 */
    resize: none;
}

.passenger-post-btn,
.driver-post-btn {
    margin: 0 5px;
    border: none;
    background-color: aquamarine;
    border-radius: 20px;
    color: #333;
    padding: 10px 20px;
    margin: 0 10px;
    cursor: pointer;
}

.passenger-post-btn.active,
.driver-post-btn.active {
    background-color: #555; /* 활성화 상태 배경색 */
    color: #fff; /* 활성화 상태 글자색 */
}

.keywords {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
}

.keyword {
    background-color:aqua;
    border-radius: 22px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    gap: 3px;
}

.keyword button {
    background-color: transparent;
    border: none;
    cursor: pointer;
}



        `}
        </style>
        <Navbar />
        <div className="main-content" style={{ display: 'flex' }}>
          <Sidebar />
          <div className="right-content">
            <div className="post-form-header">
              <h1>Select the right post for you!</h1>
              <div className="post-buttons">
                <button className="passenger-post-btn">Passenger's post</button>
                <button className="driver-post-btn">Driver's post</button>
              </div>
            </div>
            <div className="form-container">
              <div className="form-title">
                <h2>Write as a passenger</h2>
                <hr />
                <form onSubmit={handleSubmit}>
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
                  <div className="input-group keywords">
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
