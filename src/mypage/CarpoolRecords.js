import ParticipantIcon from "../icons/participant.svg";

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
          if (item.id === userId) {
            return { ...item, star };
          }
          return item;
        });
        setData(updatedData);
        setRatedTrips({ ...ratedTrips, [userId]: true });
      })
      .catch(error => console.error('Rating update failed:', error));
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

        </>
      )}
              <div className="outer-post-card">
                  <div className="post-header">
                      <div className="post-user-info">
                          <span className="user-name">{selectedTrip.nickname}</span>
                          <StarRating2 rating={selectedTrip.userDto.avgStar}/>
                      </div>
                      <div className="post-actions">
                          <StarRating
                              starsSelected={selectedTrip.star}
                              onRate={(star) => handleRating(selectedTrip.id, star)}
                              reset={resetStar}
                              disabled={ratedTrips[selectedTrip.id]}
                          />
                      </div>

                  </div>
                  <div className="inner-post-card">
                      <span
                          className="post-date">Departure time : {selectedTrip.departureDate} {selectedTrip.time}</span>
                      <div className="participant-info">
                          <img src={ParticipantIcon} alt="participant icon" className="participant-icon"/>
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
                                  <span className="location-detail1">{selectedTrip.departureDetail}</span>
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
                                  <span className="location-detail2">{selectedTrip.destinationDetail}</span>
                              </div>
                          </div>
                      </div>
                      <div className="distance-fare-container">
                          <div className="post-distance">{selectedTrip.distance}km</div>
                          <div className="post-fare">{selectedTrip.fare}원</div>
                      </div>
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
      
      .subscription-title {
        margin-left: 40px;
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
        width: 55%;
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
        margin-top: 10px;
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
        margin-top: 15px;
        font-size: 14px;
        font-weight: bold;
        color: #333;
        margin-bottom: 20px;
      }
      
      .participant-icon {
        margin-right: 10px;
        vertical-align: middle;
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
        border: 1px solid #000;
        position: relative;
        top: -15px;
      }
      
      .location-line {
        width: 1px;
        height: 50px;
        background-color: #ccc;
      }
      
      .location-details {
        flex-grow: 1;
      }
      
      .location-title1 {
        font-size: 14px;
        font-weight: bold;
        position: relative;
        top: -22px;
      }
      
     .location-title2 {
        font-size: 14px;
        font-weight: bold;
        position: relative;
        top: -15px;
      }
      
      
      
      .location-detail1 {
        font-size: 12px;
        color: #666;
       
      }
      
      .location-detail2 {
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
        padding: 6px 15px;
        cursor: pointer;
        border-radius: 5px;
        margin-left: 15px;
        margin-top: 2px; /* 별점과 버튼 사이의 간격 조정을 위해 추가 */
        position: relative; /* 위치 조정을 위해 추가 */
        top: -6px; /* 버튼을 위로 10px 이동 */
        
      }
  
      .submit-rating:hover {
        background-color: #0056b3; // 버튼에 호버 효과 추가
      }
      
      .distance-fare-container {
          display: flex;
          justify-content: flex-start; /* 좌측 정렬 */
          align-items: center;
          gap: 20px; /* 거리와 요금 사이의 간격 */
      }

        .post-distance {
          font-size: 14px;
          color: #333;
        }
        
        .post-fare {
          font-size: 13.5px;
          color: #333;
          margin-top: 10px;
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


    </div>
  );
}

export default CarpoolRecords;