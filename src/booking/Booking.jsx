// Booking.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../component/Navbar';
import Sidebar from '../component/Sidebar';
import { useNavigate } from 'react-router-dom';


function Booking() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const [showRegions, setShowRegions] = useState(false);
    const [activeButton, setActiveButton] = useState(null);
    const dropdownRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);

    useEffect(() => {
        fetchDriverPosts();
    }, []);

    const fetchDriverPosts = async () => {
        try {
            const response = await axios.get('/recruits/driver');
            setPosts(response.data);
            setActiveButton('driver');
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const fetchPassengerPosts = async () => {
        try {
            const response = await axios.get('/recruits/passenger');
            setPosts(response.data);
            setActiveButton('passenger');
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowRegions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const navigateToBookingDetail = (postId) => {
        navigate(`/booking/${postId}`);
    };

    const toggleRegionDropdown = () => {
        setShowRegions(!showRegions);
    };

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="page-container">
            <Navbar />
            <div className="main-content">
                <Sidebar />
                <div className="right-content">
                    <div className="post-form-header">
                        <h1>Choose the right post for you!</h1>
                        <div className="post-buttons">
                            <button
                                className={`passenger-post-btn ${activeButton === 'passenger' ? 'active' : ''}`}
                                onClick={fetchPassengerPosts}
                            >
                                Passenger's post
                            </button>
                            <button
                                className={`driver-post-btn ${activeButton === 'driver' ? 'active' : ''}`}
                                onClick={fetchDriverPosts}
                            >
                                Driver's post
                            </button>
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
                        {currentPosts.map((post, index) => {
                            const departureDate = new Date(post.departureDate);
                            const formattedDate = departureDate.toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            });
                            const dayOfWeek = departureDate.toLocaleDateString('en-US', { weekday: 'short' });
                            const displayDate = `${formattedDate}(${dayOfWeek}) ${post.departureTime}`;

                            return (
                                <div key={index} className="outer-post-card"
                                     onClick={() => navigateToBookingDetail(post.idxNum)}>
                                    {activeButton === 'passenger' && ( /* Passenger's post인 경우에만 텍스트를 표시 */
                                        <div className="waiting-for-text">Waiting for Driver</div>
                                    )}
                                    {activeButton === 'driver' && (
                                        <div className="waiting-for-text">Waiting for Passenger</div>
                                    )}
                                    <div className="post-header">
                                        <div className="post-user-info">
                                            <span className="user-name">{post.nickname}</span>
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
                                                    <span className="location-title1">{post.departure}</span>
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
                                                    <span className="location-title2">{post.destination}</span>
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
                        <div className="pagination-container">
                            <span className="page-number"
                                  onClick={() => paginate(currentPage - 1)}>&laquo; Previous</span>
                            {[...Array(Math.ceil(posts.length / postsPerPage)).keys()].map(number => (
                                <span
                                    key={number}
                                    className={`page-number ${currentPage === number + 1 ? 'active' : ''}`}
                                    onClick={() => paginate(number + 1)}
                                >
                                    {number + 1}
                                </span>
                            ))}
                            <span className="page-number" onClick={() => paginate(currentPage + 1)}>Next &raquo;</span>
                        </div>
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

          .right-content {
            flex-grow: 1;
            padding: 20px;
            margin-left: 130px;
          }

          .post-form-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 30px;
          }

            
         .post-buttons {
          display: flex;
          justify-content: space-between; /* 버튼을 양쪽으로 정렬 */
          width: 75%; /* 버튼 바 전체 너비 */
          margin-top: 20px; /* 버튼 바 상단 여백 */
          margin-bottom: 30px;
          gap: 400px;
         }

        .passenger-post-btn {
            flex-grow: 1; /* 버튼이 동등한 너비 차지 */
            
            color: white; /* 텍스트 색상 */
            padding: 10px 0px; /* 버튼 내부 여백 */
            margin-right: 10px;
            border: none; /* 테두리 없음 */
            border-radius: 10px; 
            font-size: 15px; /* 글꼴 크기 */
            cursor: pointer; /* 클릭 가능하다는 것을 나타내는 커서 */
            transition: background-color 0.3s; /* 호버 효과를 위한 부드러운 전환 */
            width: 350px;
            height: 50px;
        }
        
        .driver-post-btn {
            flex-grow: 1; /* 버튼이 동등한 너비 차지 */
            color: white; /* 텍스트 색상 */
            padding: 10px 0px; /* 버튼 내부 여백 */
            border: none; /* 테두리 없음 */
            border-radius: 10px; 
            font-size: 15px; /* 글꼴 크기 */
            cursor: pointer; /* 클릭 가능하다는 것을 나타내는 커서 */
            transition: background-color 0.3s; /* 호버 효과를 위한 부드러운 전환 */
            width: 250px;
            height: 50px;
        }
        
        .passenger-post-btn:hover, .driver-post-btn:hover {
            background-color: #0056b3; /* 호버 시 더 어두운 색상으로 변경 */
        }
        
        
        
        /* 접근성을 높이기 위해 포커스 스타일 추가 */
        .passenger-post-btn:focus, .driver-post-btn:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
        }
        
        .passenger-post-btn.active {
          background-image: linear-gradient(to right, #87CEEB, #50c878);
        }
        
        .driver-post-btn.active {
          background-image: linear-gradient(to right, #87CEEB, #000080);
        }
        
        .passenger-post-btn:not(.active) {
          background-color: #ffffff;
          color: grey;
        }
        
        .driver-post-btn:not(.active) {
          background-color: #ffffff;
          color: grey;
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
            margin-top: 5px;
            margin-right: 600px;
            margin-bottom: 20px;
           
          }

          .filter-btn {
            padding: 10px 20px;
            border: 1px solid #ccc;
            border-radius: 20px;
            background-color: #87CEEB;
           
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s;
            margin-right: 10px; /* 필터 버튼과 옵션 사이 간격을 추가 */
          }

          .filter-btn.active {
            background-color: #4E96FFB;
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
            height: 500px;
            max-width: 800px; /* 적절한 최대 너비 설정 */
            margin-bottom: 20px;
            padding: 20px;
          }

          .post-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
          }

          .post-user-info {
            display: flex;
            align-items: center;
            flex-direction: column; /*수직으로 배치*/
          }
          
          .user-name::after {
            content: '${activeButton === 'driver' ? 'driver' : 'passenger'}';
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
            margin-left: auto; /* 우측으로 정렬 */
            margin-left: 700px;
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

          .post-keywords {
            display: flex;
            flex-wrap: wrap; /* 키워드가 많을 경우 다음 줄로 넘어가게 설정 */
            gap: 10px; /* 키워드 사이의 간격 */
            margin-top: 20px; /* 키워드와 다른 컨텐츠 사이의 간격 */
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

        .page-number {
          cursor: pointer;
          margin: 0 8px;
          color: #000; /* 기본 색상 */
          text-decoration: none; /* 기본 텍스트 꾸미기 제거 */
        }
        
        .page-number.active {
          color: #1c5cff; /* 활성 상태일 때의 색상 */
          text-decoration: underline; /* 활성 상태일 때의 텍스트 꾸미기 */
        }

          
        `}
            </style>
        </div>
    );
}

export default Booking;