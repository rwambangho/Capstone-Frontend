import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/MyPage.css';
import Navbar from '../component/Navbar';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';

const StarRating2 = ({ rating }) => { //사용자 정보옆에 보이는 별점
  const totalStars = 5;
  let stars = [];
  for (let i = 1; i <= totalStars; i++) {
    stars.push(
      <span key={i} style={{ color: i <= rating ? 'gold' : 'gray' }}>★</span>
    );
  }
  return <div>{stars}</div>;
};

const StarRating = ({ starsSelected = 0, totalStars = 5, onRate = f => f, reset, disabled = false }) => {
  const [selected, setSelected] = useState(starsSelected);
  const [hovered, setHovered] = useState(0);

  useEffect(() => {
    setSelected(0); // 다른 글을 클릭하면 별을 초기화
  }, [reset]);

  const handleClick = (rating) => { //별을 클릭하면 선택한 별만큼 보임
    if (!disabled) {
      setSelected(rating);
    }
    
  };

  return (
    <div className="star-rating">
      {[...Array(totalStars)].map((n, i) => (
        <span
          key={i}
          className="star"
          onMouseOver={() => !disabled && setHovered(i + 1)}
          onMouseOut={() => !disabled && setHovered(0)}
          onClick={() => handleClick(i + 1)}
        >
          {i < selected || i < hovered ? (
            <FaStar color="gold" size={24} />
          ) : (
            <FaStar color="gray" size={24} />
          )}
        </span>
      ))}
      {!disabled && <button className="submit-rating" onClick={() => onRate(selected)}>Submit</button>}
    </div>
  );
};

function CarpoolRecords() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(getCookieValue("nickname"));
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [resetStar, setResetStar] = useState(false);
  const [ratedTrips, setRatedTrips] = useState({});
  const [ongoingData, setOngoingData] = useState([]); // 완료되지 않은 카풀 리스트
  const [completedData, setCompletedData] = useState([]); // 완료된 카풀 리스트

  useEffect(() => {
    axios.get('/api/recruits/records', {
      params: {
        nickname: user,
      }
    })
      .then(response => {
        setData(response.data);
        const ongoing = response.data.filter(item => !item.full);
        const completed = response.data.filter(item => item.full);
        console.log("Ongoing Data:", ongoing);
        console.log("Completed Data:", completed);
        setOngoingData(ongoing);
        setCompletedData(completed); 
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [user]);

  const handleRating = (userId, star) => {
    axios.put(`/api/recruits/star`, { id: userId, star: star })
      .then(() => {
        const updatedData = data.map(item => {
          if (item.userId === userId) {
            return { ...item, star }; 
          }
          return item;
        });
        setData(updatedData);
        setRatedTrips({ ...ratedTrips, [userId]: true });
      })
      .catch(error => console.error('Rating update failed:', error));
  };

  const StarRating = ({ starsSelected = 0, totalStars = 5, onRate = f => f }) => {
    const [hovered, setHovered] = useState(0);
  
    return (
      <div className="star-rating">
        {[...Array(totalStars)].map((n, i) => (
          <span
            key={i}
            className="star"
            onMouseOver={() => setHovered(i + 1)}
            onMouseOut={() => setHovered(0)}
            onClick={() => onRate(i + 1)}
          >
            {i < starsSelected || i < hovered ? (
              <PiStarFill color="gold" size={24} />
            ) : (
              <PiStarLight color="gray" size={24} />
            )}
          </span>
        ))}
      </div>
    );
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

 

  const handleTripClick = (trip) => {
    setSelectedTrip(trip);
    setResetStar(!resetStar); // Toggle resetStar to trigger star rating reset
  };

  return (
    <div>
      <Navbar />
      <h2 className="subscription-title">Carpool list</h2>
     
      <div className="carpool-container">
      <div className="sidebar">
          <div className="trip-list">
            <h3>Ongoing carpool list</h3>
            <ul>
              {ongoingData.map(item => (
                <li key={item.id} onClick={() => handleTripClick(item)}>
                  <span>{item.departureDate} {item.time} </span>
                  <span>{item.departure} - {item.destination}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="trip-list">
            <h3>Completed carpool list</h3>
            <ul>
              {completedData.map(item => (
                <li key={item.id} onClick={() => handleTripClick(item)}>
                  <span>{item.departureDate} {item.time} </span>
                  <span>{item.departure} - {item.destination}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="main-content">
          {selectedTrip  ?(
            <>
               {selectedTrip.full && (
        <>
          <h2>Star Rating</h2>
          <div className="post-actions">
            <StarRating
              starsSelected={selectedTrip.star}
              onRate={(star) => handleRating(selectedTrip.id, star)}
              reset={resetStar}
              disabled={ratedTrips[selectedTrip.id]}
            />
          </div>
        </>
      )}
              <div className="outer-post-card">
                <div className="post-header">
                  <div className="post-user-info">
                    <span className="user-name">{selectedTrip.nickname}</span>
                    <StarRating2 rating={selectedTrip.userDto.avgStar} />
                    <span className="post-date">{selectedTrip.departureDate} {selectedTrip.time}</span>
                  </div>
                
                  <div className="post-fare">{selectedTrip.fare}원</div>
                </div>
                <div className="inner-post-card">
                  <span className="post-date">Departure time : {selectedTrip.departureDate} {selectedTrip.time}</span>
                  <div className="participant-info">
                    <span>{selectedTrip.participant}/{selectedTrip.maxParticipant}</span>
                  </div>
                  <div className="location-container">
                    <div className="location-marker departure-marker">
                      <div className="location-dot-white"></div>
                      <div className="location-line"></div>
                    </div>
                    <div className="location-details">
                      <div className="location-point departure">
                        <span className="location-title1">{selectedTrip.departure}</span>
                        <span className="location-detail">{selectedTrip.departureDetail}</span>
                      </div>
                    </div>
                  </div>
                  <div className="location-container">
                    <div className="location-marker destination-marker">
                      <div className="location-dot-blue"></div>
                    </div>
                    <div className="location-details">
                      <div className="location-point destination">
                        <span className="location-title2">{selectedTrip.destination}</span>
                        <span className="location-detail">{selectedTrip.destinationDetail}</span>
                      </div>
                    </div>
                  </div>
                  <div className="post-distance">{selectedTrip.distance}km</div>
                </div>
                <div className='post-form-bottom'>
                  <div className="post-keywords">
                    {selectedTrip.keywords && selectedTrip.keywords.map((keyword, kIndex) => (
                      <span key={kIndex} className="post-keyword">{keyword}</span>
                    ))}
                  </div>
                  <div className="post-created-at">
                    {new Date(selectedTrip.createdAt).toLocaleString()}
                  </div>
                </div>
                
              </div>
            </>
          ) : (
            <p>Please select a post</p>
          )}
        </div>
      </div>
   
 <style>
      {`
     
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
      }
      
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        padding: 10px 20px;
        border-bottom: 1px solid #ccc;
      }
      
      .logo {
        font-size: 24px;
        font-weight: bold;
      }
      
      nav ul {
        list-style: none;
        display: flex;
        gap: 20px;
      }
      
      nav ul li a {
        text-decoration: none;
        color: #000;
      }
      
      .my-page button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
      }
      
      .carpool-container {
        display: flex;
        margin: 20px;
      }
      
      .sidebar {
        width: 30%;
        background-color: #fff;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      
      .trip-list ul {
        list-style: none;
        padding: 0;
      }
      
      .trip-list li {
        padding: 10px;
        border-bottom: 1px solid #ccc;
        transition: background-color 0.3s;
      }
      
      .trip-list li:hover {
        background-color: #f1f1f1;
      }
      
      .trip-list li a {
        text-decoration: none;
        color: #000;
      }
      
      .main-content {
        width: 70%;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        background-color: #fff;
        margin-left: 20px;
      }
      
      .outer-post-card {
        border-bottom: 1px solid #ccc;
        margin-bottom: 20px;
        padding-bottom: 20px;
      }
      
      .post-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      
      .post-user-info {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .user-name {
        font-size: 16px;
        font-weight: bold;
      }
      
      .post-date {
        font-size: 14px;
        color: #666;
      }
      
      .post-distance2, .post-distance1, .post-fare {
        font-size: 14px;
        color: #333;
      }
      
      .inner-post-card {
        border-top: 1px solid #eee;
        padding-top: 10px;
      }
      
      .participant-info {
        font-size: 14px;
        color: #333;
        margin-bottom: 10px;
      }
      
      .location-container {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
      
      .location-marker {
        width: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 10px;
      }
      
      .location-dot-white, .location-dot-blue {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
      
      .location-dot-white {
        background-color: #fff;
        border: 1px solid #000;
      }
      
      .location-dot-blue {
        background-color: #007bff;
      }
      
      .location-line {
        width: 1px;
        height: 20px;
        background-color: #ccc;
      }
      
      .location-details {
        flex-grow: 1;
      }
      
      .location-title1, .location-title2 {
        font-size: 14px;
        font-weight: bold;
      }
      
      .location-detail {
        font-size: 12px;
        color: #666;
      }
      
      .post-distance {
        font-size: 14px;
        color: #333;
        margin-top: 10px;
      }
      
      .post-form-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
      }
      
      .post-keywords {
        display: flex;
        gap: 10px;
      }
      
      .post-keyword {
        font-size: 12px;
        color: #007bff;
        background-color: #eef;
        padding: 5px;
        border-radius: 3px;
      }
      
      .post-created-at {
        font-size: 12px;
        color: #999;
      }
      
      .filter-section {
        margin-bottom: 20px;
      }
      
      .filter-options {
        display: flex;
        justify-content: space-around;
      }
      
      .filter-option {
        cursor: pointer;
        padding: 10px;
        border: 1px solid #ccc;
        background-color: #f9f9f9;
        border-radius: 5px;
        transition: background-color 0.3s, color 0.3s;
      }
      
      .filter-option:hover {
        background-color: #e9e9e9;
        color: #007bff;
      }
      
      .star {
        color: gray;
        cursor: pointer;
      }
      
      .star.selected {
        color: yellow;
      }

      .submit-rating {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        border-radius: 5px;
        margin-top: 10px; // 별점과 버튼 사이의 간격 조정을 위해 추가
      }
  
      .submit-rating:hover {
        background-color: #0056b3; // 버튼에 호버 효과 추가
      }
      .sidebar {
        width: 30%;
        background-color: #fff;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      
      .trip-list ul {
        list-style: none;
        padding: 0;
      }
      
      .trip-list li {
        padding: 15px;
        border-bottom: 1px solid #ccc;
        transition: background-color 0.3s;
        cursor: pointer;
      }
      
      .trip-list li:hover {
        background-color: #f1f1f1;
      }
      
      .trip-list li span {
        display: block;
        margin-bottom: 5px;
      }
      
      .trip-list li span.departure-time {
        font-weight: bold;
        color: #007bff;
      }
      
      .trip-list li span.route {
        color: #555;
      }
      
      .trip-list li:last-child {
        border-bottom: none;
      }
      
      
      `}
      </style>


      <h2>Carpool list</h2>
      {/* <div className="filter-section">
          <div className="filter-options">
            <span className="filter-option" onClick={() => filterPosts('Ongoing carpool list')}>Ongoing carpool list</span>
            <span className="filter-option" onClick={() => filterPosts('Completed carpool list')}>Completed carpool list</span>
            <span className="filter-option" onClick={() => filterPosts('My carpool requests')}>My carpool requests</span>
            <span className="filter-option" onClick={() => filterPosts('Requested carpool list to me')}>Requested carpool list to me</span>
          </div>
       </div> */}
      <div className="carpool-container">
      
        <div className="sidebar">
          
          <div className="trip-list">
          <ul>
            {data.map(item => (
              <li key={item.id}>
                <Link to={`/booking/${item.idxNum}`}>{item.nickname} - {item.title}</Link>
                <span>{item.departureDate} {item.departureTime} Departure</span>
                <span>{item.departure} - {item.destination}</span>
              </li>
            ))}
          </ul>
          </div>
        </div>
        <div className="main-content">
        
        {data.map((item) => {
          
                            const departureDate = new Date(item.departureDate);
                            const formattedDate = departureDate.toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            });
                            const dayOfWeek = departureDate.toLocaleDateString('en-US', { weekday: 'short' });
                            const displayDate = `${formattedDate}(${dayOfWeek}) ${item.departureTime}`;

                            return (
                              
                                <div className="outer-post-card" >
                                <h2>Star Rating</h2>
                                    <div className="post-header">
                                    <StarRating
                    starsSelected={item.star}
                    onRate={(star) => handleRating(item.id, star)}
                  />
                  
                                        <div className="post-user-info">
                                            <span className="user-name">{item.nickname}</span>
                                            <StarRating2 rating={item.userDto.avgStar} />
                                            
                                            <span className="post-date">{displayDate}</span>
                                        </div>
                                        <div className="post-distance2">{item.distance2}km</div>
                                        <div className="post-distance1">{item.distance}km</div>
                                        <div className="post-fare">{item.fare}원</div>
                                    </div>
                                    <div className="inner-post-card">
                                        <span className="post-date">Departure time : {displayDate}</span>
                                        <div className="participant-info">
                                            {/* <img src={ParticipantIcon} alt="Participant Icon"
                                                 className="participant-icon"/> */}
                                            <span>{item.participant}/{item.maxParticipant}</span>
                                        </div>
                                        <div className="location-container">
                                            <div className="location-marker departure-marker">
                                                <div className="location-dot-white"></div>
                                                <div className="location-line"></div>
                                            </div>
                                            <div className="location-details">
                                                <div className="location-point departure">
                                                    <span className="location-title1">{item.departure}</span>
                                                    <span className="location-detail">{item.departureDetail}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="location-container">
                                            <div className="location-marker destination-marker">
                                                <div className="location-dot-blue"></div>
                                            </div>
                                            <div className="location-details">
                                                <div className="location-point destination">
                                                    <span className="location-title2">{item.destination}</span>
                                                    <span className="location-detail">{item.destinationDetail}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="post-distance">{item.distance}km</div>
                                    </div>
                                    <div className='post-form-bottom'>
                                        <div className="post-keywords">
                                            {item.keywords && item.keywords.map((keyword, kIndex) => (
                                                <span key={kIndex} className="post-keyword">{keyword}</span>
                                            ))}
                                        </div>
                                        <div className="post-created-at">
                                            {new Date(item.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="post-actions"></div>
                                    
                                </div>
                            );
                        })}
        </div>
  </div>
      <style>
      {`
      .star {
        color: gray;
        cursor: pointer;
      }

      .star.selected {
        color: yellow;
      }
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
      }

      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: white;
        padding: 10px 20px;
        border-bottom: 1px solid #ccc;
      }

      .logo {
        font-size: 24px;
        font-weight: bold;
      }

      nav ul {
        list-style: none;
        display: flex;
        gap: 20px;
      }

      nav ul li a {
        text-decoration: none;
        color: #000;
      }

      .my-page button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
      }

      .carpool-container {
        display: flex;
        margin: 20px;
      }

      .sidebar {
        width: 30%;
        background-color: white;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }

      .tabs {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .tab-button {
        background-color: #e9e9e9;
        border: none;
        padding: 10px;
        cursor: pointer;
        text-align: left;
      }

      .tab-button.active {
        background-color: #007bff;
        color: white;
      }

      .trip-list {
        margin-top: 20px;
      }

      .trip-item {
        padding: 10px;
        background-color: #e9e9e9;
        margin-bottom: 10px;
        cursor: pointer;
      }

      .trip-item.active {
        background-color: #007bff;
        color: white;
      }

      .main-content {
        flex-grow: 1;
        margin-left: 20px;
        background-color: white;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }

      .driver-info {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      .driver-profile img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .trip-route, .trip-options, .comments, .rating {
        margin-top: 20px;
      }

      .trip-options button {
        background-color: #e9e9e9;
        border: none;
        padding: 10px;
        margin-right: 10px;
        cursor: pointer;
      }

      .comments {
        background-color: #f5f5f5;
        padding: 10px;
        border-radius: 5px;
      }

      .action-buttons {
        margin-top: 20px;
      }

      .action-buttons button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        margin-right: 10px;
        cursor: pointer;
      }

      .rating .stars {
        display: flex;
        gap: 5px;
        cursor: pointer;
      }

      .rating .stars span {
        font-size: 24px;
        color: #ccc;
      }

      .rating .stars span.selected,
      .rating .stars span:hover,
      .rating .stars span:hover ~ span {
        color: #ff0;
      }

      .rating .submit-rating {
        margin-left: 20px;
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
      }
      .outer-post-card {
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border-radius: 8px;
            width: 100%;
            height: 400px;
            max-width: 800px; /* 적절한 최대 너비 설정 */
            margin-bottom: 20px;
            padding: 20px;
          }

          .post-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .post-user-info {
            margin-top: 30px;
            margin-left: 10px;
            display: flex;
            align-items: center;
            flex-direction: column; /*수직으로 배치*/
          }

          .user-name::after {
            display: inline-block;
            background-color: rgba(28, 92, 255, 0.6); /* 배경색 */
            color: white; /* 텍스트 색상 */
            font-size: 0.8em; /* 글꼴 크기 */
            font-weight: normal; /* 일반체로 설정 */
            border-radius: 20px; /* 원형 모양 */
            padding: 3px 8px; /* 내부 여백 */
            margin-left: 15px; /* 사용자 이름과의 간격 */
            margin-top: -5px;
        }

        .waiting-for-text {
            
            font-weight: bold;
            color: blue;
            text-align: right;
            margin-right: 10px;
            margin-top: 15px;
        }



          .user-details {
            margin-left: 10px;
          }

          .user-name {
            font-weight: bold;
          }

          .post-date {
            margin-left: 30px;
            font-weight: 700;
            color: #black;
            margin-bottom: 20px;
          }

          .post-distance {
            margin-left: 30px;
            margin-top: 10px;
            margin-bottom: 10px;
            font-weight: 600;
            color: #888888;
          }

          .inner-post-card {
            background-color: #f5f5f5;
            padding: 30px 10px;
            border-radius: 8px;
            margin-top: 40px;
            padding-bottom: 20px;
            position: relative;
          }

          .post-location {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
          }

          .location-container {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
            position: relative;
            margin-top:10px;
          }

          .post-keywords {
            display: flex;
            flex-wrap: wrap; /* 키워드가 많을 경우 다음 줄로 넘어가게 설정 */
            gap: 10px; /* 키워드 사이의 간격 */
            margin-top: 30px; /* 키워드와 다른 컨텐츠 사이의 간격 */
          }

          .post-keyword {
            background-color: #50c878; /* 밝은 녹색 배경 */
            color: white; /* 흰색 텍스트 */
            padding: 8px 16px; /* 상하 8px, 좌우 16px의 패딩 */
            border-radius: 20px; /* 둥근 모서리 */
            font-size: 0.9em; /* 적절한 텍스트 크기 */
            white-space: nowrap; /* 키워드를 한 줄로 표시 */
          }

          .post-created-at {
            font-size: 1rem;
            color: #666;
            margin-top: 25px;
            margin-bottom: 10px;
          }

          .location-marker {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 10px;
          }

          .location-dot-white {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #fff;
            border: 3px solid blue; /* 흰색 동그라미에 파란색 테두리 */
            z-index: 2;
            position: relative; /* 위치를 조정하기 위해 relative로 설정 */
            margin-top: 20px;
            margin-bottom: 10px; /* 선과의 간격 */
            margin-left: 28px;
          }

          .location-dot-blue {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: blue;
            border: 2px solid blue; /* 파란색 테두리 추가 */
            position: absolute; /* 절대 위치 지정 */
            top: 50%; /* 부모 요소의 상단에서 50% 위치 */
            left: 0; /* 부모 요소의 왼쪽에 배치 */
            transform: translate(-50%, -50%); /* 부모 요소의 중앙으로 이동 */
            z-index: 3; /* 흰색 동그라미 위에 배치 */
            margin-left: 35px;
            margin-top: 20px;
          }

          .location-point {
            text-align: center;
          }
          
          .location-title1 {
            font-weight: bold;
            display: block; /* 타이틀을 블록 요소로 만들어 줄 바꿈 */
            margin-top: 8px;
            margin-left: -45px;
          }

          .location-title2 {
            font-weight: bold;
            display: block; /* 타이틀을 블록 요소로 만들어 줄 바꿈 */
            margin-top: 35px;
          }

          .location-details {
            margin-left: 50px; /* 선과의 간격을 만들기 위해 margin-left 적용 */
            display: flex;
            justify-content: column;
            align-items: center;
            min-height: 60px; /* 세부사항이 적을 때도 컨테이너가 줄어들지 않도록 최소 높이 설정 */
          }

          .location-line {
            width: 2px;
            height: 150%; /* 선의 높이를 조정하여 전체 컨테이너를 커버하도록 함 */
            background-color: blue;
            position: absolute;
            left: 5px; /* 선을 동그라미의 중앙에 위치시킴 */
            top: 12px; /* 선의 시작 위치를 조정 */
            margin-left: 30px;
            margin-top: 20px;
          }

          .post-date-time {
            text-align: center;
            margin-top: 20px;
          }

          .location-point.departure,
          .location-point.destination {
            text-align: left;
            flex-grow: 1;
          }

          .location-title,
          .location-detail {
            color: #333; /* 텍스트 색깔 */
            font-size: 0.9em; /* 텍스트 크기 */
          }
          
          .pagination-container {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        

      `}
      </style>
    </div>
  );
}



export default CarpoolRecords;