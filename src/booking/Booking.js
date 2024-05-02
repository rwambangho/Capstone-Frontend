import React, { useState, useEffect } from 'react';
import Navbar from '../component/Navbar';
import Sidebar from '../component/Sidebar';
import axios from 'axios';
import '../css/booking/Booking.css';



function Booking() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/recruits');
        setPosts(response.data);
        console.log(response.data);
        console.log(posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  
  return (
    <div className="page-container">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="right-content">
          <div className="post-form-header">
            <h1>Choose the right post for you!</h1>
            <div className="post-buttons">
              <button className="passenger-post-btn">Passenger's post</button>
              <button className="driver-post-btn">Driver's post</button>
            </div>
            <div className="search-section">
              <input type="text" className="search-input" placeholder="Search for regions and keywords..." />
            </div>
            <div className="filter-section">
              <button className="filter-btn active">entire</button>
              <div className="filter-options">
                <span className="filter-option">Latest</span>
                <span className="filter-option">Close</span>
                <span className="filter-option">departure time</span>
              </div>
            </div>
          </div>
          <div className="posts-container">
            {posts.map((post, index) => {
              // departureDate 문자열을 Date 객체로 변환
              const departureDate = new Date(post.departureDate);
              // 날짜를 "YYYY-MM-DD" 형태로 포맷팅
              const formattedDate = departureDate.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              });
              // 요일 구하기
              const dayOfWeek = departureDate.toLocaleDateString('en-US', { weekday: 'short' });
              // 포맷팅된 날짜, 요일, 출발 시간을 결합
              const displayDate = `${formattedDate}(${dayOfWeek}) ${post.departureTime}`;

              return (
                <div key={index} className="outer-post-card">
                  <div className="post-header">
                    <div className="post-user-info">
                      <span className="user-name">{post.username}</span>
                      <span className="post-date">{displayDate}</span>
                    </div>
                    <div className="post-distance">{post.distance}</div>
                  </div>
                  <div className="inner-post-card">
                    <div className="location-container">
                      <div className="location-marker departure-marker">
                        <div className="location-dot-white"></div>
                        <div className="location-line"></div>
                      </div>
                      <div className="location-details">
                        <div className="location-point departure">
                          <span className="location-title">{post.departure}</span>
                          <span className="location-detail">{post.departureDetail}</span>
                        </div>
                      </div>
                    </div>
                    <div className="location-container"> 
                      <div className="location-marker destination-marker">
                        <div className="location-dot-blue"></div>
                      </div>
                      <div className="location-details">
                        <div className="location-point destination">
                          <span className="location-title">{post.destination}</span>
                          <span className="location-detail">{post.destinationDetail}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="post-actions"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;