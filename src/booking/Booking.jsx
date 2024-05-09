import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../component/Navbar';
import Sidebar from '../component/Sidebar';
import { useNavigate } from 'react-router-dom';

const StarRating = ({ rating }) => {
  const totalStars = 5;
  let stars = [];
  for (let i = 1; i <= totalStars; i++) {
      stars.push(
          <span key={i} style={{ color: i <= rating ? 'gold' : 'gray' }}>★</span>
      );
  }
  return <div>{stars}</div>;
};
function Booking() {
  const [posts, setPosts] = useState([]);
  const [showRegions, setShowRegions] = useState(false);  // 드롭다운 리스트 표시 상태
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // useRef로 참조 생성
  
  useEffect(() => {
    
    fetchPassengerPosts();
    fetchDriverPosts();
  }, []);


  const fetchDriverPosts = async () => {
    try {
      const response = await axios.get('/recruits/driver');
      setPosts(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchPassengerPosts = async () => {
    try {
      const response = await axios.get('/recruits/passenger');
      setPosts(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  
  useEffect(() => {
    // 외부 클릭 감지를 위한 함수
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowRegions(false); // 드롭다운 외부 클릭 시 숨김
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);


  // 포스트 클릭 시 상세 페이지로 이동
  const navigateToBookingDetail = (postId) => {
    navigate(`/booking/${postId}`); // 해당 포스트의 ID를 파라미터로 전달하여 상세 페이지로 이동
  };
  // 'entire' 버튼을 클릭할 때 실행될 함수
  const toggleRegionDropdown = () => {
    setShowRegions(!showRegions);  // 상태 토글
  };

  return (
      <div className="page-container">
        <Navbar />
        <div className="main-content">
          <Sidebar />
          <div className="right-content">
            <div className="post-form-header">
              <h1>Choose the right post for you!</h1>
              <div className="post-buttons">
                <button className="passenger-post-btn" onClick={fetchPassengerPosts}>Passenger's post</button>
                <button className="driver-post-btn" onClick={fetchDriverPosts}>Driver's post</button>
              </div>
              <div className="search-section">
                <input type="text" className="search-input" placeholder="Search for regions and keywords..." />
              </div>
              <div className="filter-section">
              <button className="filter-btn active" onClick={toggleRegionDropdown}>entire</button>
                {showRegions && (
                    <div className="region-dropdown" ref={dropdownRef}>
                      <div className="region-item">Seoul</div>
                      <div className="region-item">Gyeonggi</div>
                      <div className="region-item">Incheon</div>
                      <div className="region-item">Busan</div>
                      <div className="region-item">Jeju</div>
                      <div className="region-item">Ganwon</div>
                    </div>
                )}
                <div className="filter-options">
                  <span className="filter-option">Latest</span>
                  <span className="filter-option">Close</span>
                  <span className="filter-option">departure time</span>
                </div>
              </div>
            </div>
            <div className="posts-container">
              {posts.map((post, index) => {
                const departureDate = new Date(post.departureDate);
                const formattedDate = departureDate.toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                });
                const dayOfWeek = departureDate.toLocaleDateString('en-US', { weekday: 'short' });
                const displayDate = `${formattedDate}(${dayOfWeek}) ${post.departureTime}`;

                return (
                    <div key={index} className="outer-post-card" onClick={() => navigateToBookingDetail(post.idxNum)}>
                      <div className="post-header">
                        <div className="post-user-info">
                          <span className="nick-name">{post.nickname}</span>
                          <StarRating rating={post.avgStar} />
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
                      <div className='post-form-bottom'>
                        <div className="post-keywords">
                          {post.keywords && post.keywords.map((keyword, kIndex) => (
                              <span key={kIndex} className="post-keyword">{keyword}</span>
                          ))}
                        </div>
                        <div className="post-created-at">
                          {new Date(post.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="post-actions"></div>
                      {post.driverPost && (
    <div>
        {post.participant}/{post.maxParticipant}
    </div>
)}
                    </div>
                );
              })}
            </div>
          </div>
        </div>
        <style>
          {`
            .main-content {
            flex-grow: 1;
            display: flex;
            padding: 20px;
            margin-right: 300px;
          }

          .right-content {
            flex-grow: 1;
            padding: 20px;
            background-color: #f5f5f5;
          }

          .post-form-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 30px;
          }

          .post-buttons {
            display: flex;
            margin-top: 20px;
            justify-content: space-between; /* 버튼을 양쪽으로 정렬 */
            gap: 600px;
            
          }

          .search-section {
            display: flex;
            justify-content: center;
            padding: 15px 20px;
            margin-top: 20px;
            width: 65%;
            
          }

          .search-input {
            width: calc(100% - 42px);
            padding: 15px 20px;
            border: 2px solid #ccc;
            border-radius: 10px;
            margin-right: -2px; 
          }

           
          .region-dropdown {
          background-color: white;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 5px 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          position: absolute;
          width: 200px;
          z-index: 100;
        }
    
          .region-item {
            padding: 5px 0;
            cursor: pointer;
            transition: background-color 0.2s;
          }
    
    .region-item:hover {
      background-color: #f0f0f0;
    }


          .filter-buttons {
            display: flex;
            justify-content: center;
            margin-top: 10px;
            gap: 10px;
          }

          .filter-section {
            display: flex;
            flex-direction: column; 
            margin-top: -8px;
            margin-right: 620px;
            margin-bottom: 30px;
            
          }

          .filter-btn {
            padding: 10px 20px;
            border: 1px solid #ccc;
            border-radius: 20px;
            background-color: #779DFF;
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s;
            margin-right: 10px; /* 필터 버튼과 옵션 사이 간격을 추가 */
          }

          .filter-btn.active {
            background-color: #007bff;
            color: white;
          }

          .filter-options {
            display: flex;
            flex-direction: row; 
            align-items: center; 
            justify-content: flex-start; 
          }

          .filter-option {
            cursor: pointer;
            transition: color 0.3s;
            padding: 5px 0; 
            margin-right: 10px;
          }

          .filter-option:hover {
            color: #007bff; /* 호버 효과 색상 */
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
            display: flex;
            align-items: center;
            flex-direction: column; /*수직으로 배치*/
          }

          .user-avatar {
            /* 아바타 스타일 */
          }

          .user-details {
            margin-left: 10px;
          }

          .user-name {
            font-weight: bold;
          }

          .post-date {
            margin-top: 30px;
           
            
          }

          .post-distance {
            /* 거리 스타일 */
          }

          .inner-post-card {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 8px;
            margin-top: 50px;
            margin-bottom: 10px;
          }

          .posts-container {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .post-card {
            background-color: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            border-radius: 8px;
            width: 100%;
            max-width: 600px; /* Adjust based on your layout */
            margin-bottom: 20px;
            padding: 20px;
          }

          .post-title {
            font-size: 1.2em;
            margin-bottom: 15px;
          }

          .post-info {
            margin-bottom: 15px;
          }

          .post-departure,
          .post-destination,
          .post-date-time {
            margin-bottom: 10px;
            
          }

          .post-actions {
            text-align: right;
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
          }

          .post-keyword {
            background-color: green;
            color: white;
            padding: 10px 20px;
            border-radius: 15px;
            margin-right: 20px;
            
            
            
          }

          .post-created-at {
            font-size: 1rem;
            color: #666;
            margin-top: 55px;
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
            border: 2px solid blue; /* 흰색 동그라미에 파란색 테두리 */
            z-index: 2;
            position: relative; /* 위치를 조정하기 위해 relative로 설정 */
            margin-top: 20px;
            margin-bottom: 10px; /* 선과의 간격 */
            margin-left: 30px;
          }

          .location-dot-blue {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: blue;
            border: 2px solid white; /* 흰색 테두리 추가 */
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

          .location-title {
            font-weight: bold;
            
            display: block; /* 타이틀을 블록 요소로 만들어 줄 바꿈 */
            margin-top: 35px;
            
          }

          .location-details {
            margin-left: 50px; /* 선과의 간격을 만들기 위해 margin-left 적용 */
            flex-grow: 1;
            display: flex;
            justify-content: space-between;
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

          .location-point.departure {
            text-align: left;
            flex-grow: 1;
            
          }
          
     
          .location-point.destination {
            text-align: left;
            flex-grow: 1;
            
          }

          .location-title,
          .location-detail {
            color: #333; /* 텍스트 색깔 */
            font-size: 0.9em; /* 텍스트 크기 */
            
          }
        `}
        </style>
      </div>
  );
}

export default Booking;