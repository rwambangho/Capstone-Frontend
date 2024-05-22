import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../component/Navbar';
import { useNavigate } from 'react-router-dom';
import PassengerIcon from '../icons/icon.svg';
import DriverIcon from '../icons/driver.svg';
import GrayPassengerIcon from '../icons/grayicon.svg';
import GrayDriverIcon from '../icons/graydriver.svg';
import ParticipantIcon from '../icons/participant.svg';

const StarRating = ({ rating }) => {
    console.log(rating);
    const totalStars = 5;
    let stars = [];
    for (let i = 1; i <= totalStars; i++) {
        stars.push(
            <span key={i} style={{ color: i <= rating ? 'gold' : 'gray' }}>★</span>
        );
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '-5px', marginTop: '5px' }}>
            {stars}
        </div>
    );
};

function Booking() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const [showRegions, setShowRegions] = useState(false);
    const [activeButton, setActiveButton] = useState(null);
    const dropdownRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const [distances, setDistances] = useState({});
    const [latitude, setLatitude] = useState({});
    const [longitude, setLongitude] = useState({});
    const [isDriver, setDriver] = useState();

    useEffect(() => {
        fetchDriverPosts();
        fetchPassengerPosts();
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            setLatitude(latitude);
            setLongitude(longitude);
            console.log(latitude, longitude);
        });
        updateDistances(latitude, longitude);
    }, [latitude]);

    const updateDistances = (latitude, longitude) => {
        posts.forEach(post => {
            const postData = {
                currentX: longitude,
                currentY: latitude,
                arrivalX: post.departureX,
                arrivalY: post.departureY
            };
            axios.put('/recruits/distance2', postData)
                .then(response => {
                    setDistances(prev => ({ ...prev, [post.idxNum]: response.data }));
                    console.log(post.idxNum);
                })
                .catch(error => console.error('Error calculating distance:', error));
        });
    };

    const fetchDriverPosts = async () => {
        try {
            const response = await axios.get('/recruits/driver');
            setPosts(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            setDriver(true);
            setActiveButton('driver');
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const fetchPassengerPosts = async () => {
        try {
            const response = await axios.get('/recruits/passenger');
            setPosts(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            setDriver(false);
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

    const filterPosts = (filter) => {
        if (filter === 'latest') {
            const sorted = [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPosts(sorted);
        } else if (filter === 'close') {
            const sorted = [...posts].sort((a, b) => a.distance - b.distance);
            setPosts(sorted);
        } else if (filter === 'departure time') {
            const sorted = [...posts].sort((a, b) => new Date(a.departureDate) - new Date(b.departureDate));
            setPosts(sorted);
        }
    };

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="page-container">
            <Navbar />
            <div className="main-content">
                <div className="right-content">
                    <div className="post-form-header">
                        <h1>Please choose the post that suits you</h1>
                        <div className="post-buttons">
                            <button
                                className={`passenger-post-btn ${activeButton === 'passenger' ? 'active' : ''}`}
                                onClick={fetchPassengerPosts}
                            >
                                <div className="button-content">
                                    {activeButton === 'passenger' ? (
                                        <img src={PassengerIcon} alt="Passenger Icon" className="post-icon" />
                                    ) : (
                                        <img src={GrayPassengerIcon} alt="Gray Passenger Icon" className="post-icon" />
                                    )}
                                    Passenger's post
                                </div>
                            </button>
                            <button
                                className={`driver-post-btn ${activeButton === 'driver' ? 'active' : ''}`}
                                onClick={fetchDriverPosts}
                            >
                                <div className="button-content">
                                    {activeButton === 'driver' ? (
                                        <img src={DriverIcon} alt="Driver Icon" className="post-icon" />
                                    ) : (
                                        <img src={GrayDriverIcon} alt="Gray Driver Icon" className="post-icon" />
                                    )}Driver's post
                                </div>
                            </button>
                        </div>

                        <div className="filter-section">
                            <div className="filter-options">
                                <span className="filter-option" onClick={() => filterPosts('latest')}>Latest</span>
                                <span className="filter-option" onClick={() => filterPosts('close')}>Close</span>
                                <span className="filter-option" onClick={() => filterPosts('departure time')}>Departure Time</span>
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
                            const displayDate = `${formattedDate}(${dayOfWeek}) ${post.time}`;

                            return (
                                <div key={index} className="outer-post-card"
                                     onClick={() => navigateToBookingDetail(post.idxNum)}>
                                    <div className="post-header">
                                        <div className="post-user-info">
                                            {post.userDto.profileImage ? (
                                                <img src={post.userDto.profileImage.replace('/home/ubuntu/images', '/images')} alt="Profile"
                                                     className="profile-image" />
                                            ) : null}
                                            <div className="user-details">
                                                <div className="user-name">{post.nickname}
                                                    <span className="user-role">{isDriver ? 'Driver' : 'Passenger'}</span>
                                                </div>
                                                {isDriver && <StarRating rating={post.avgStar} />}
                                            </div>
                                        </div>
                                        {activeButton === 'passenger' && (
                                            <div className="waiting-for-text">Waiting<br /> for Driver</div>
                                        )}
                                        {activeButton === 'driver' && (
                                            <div className="waiting-for-text">Waiting<br /> for Passenger</div>
                                        )}
                                    </div>
                                    <div className="post-distance" style={{ textAlign: 'right', marginRight: '5px' }}>
                                        current location : {distances[post.idxNum]}km
                                    </div>
                                    <div className="inner-post-card">
                                        <span className="post-date">Departure time : {displayDate}</span>
                                        <div className="participant-info">
                                            <img src={ParticipantIcon} alt="Participant Icon"
                                                 className="participant-icon" />
                                            <span>{post.participant}/{post.maxParticipant}</span>
                                        </div>
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
                                        <div className="post-details">
                                            <div className="post-fare">Taxi fare : {post.fare}₩</div>
                                            <div className="post-distance">({post.distance}km)</div>
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
          }

          .right-content {
            flex-grow: 1;
            padding: 20px;
            margin-left: 160px;
          }

          .post-form-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 30px;
          }
          
          .post-form-header h1 {
           font-size: 50px;
           margin-bottom: 60px; /* 텍스트 아래 여백 추가 */
           color: #B9CDFF;
           font-family: 'Sansation', sans-serif;
           font-weight: bold;
           display: inline-block;
           margin-bottom: 30px;
           background: -webkit-linear-gradient(45deg, #B9CDFF, #123456); /* 크롬, 사파리 등 대부분의 브라우저용 */
           background: linear-gradient(45deg, #B9CDFF, #123456); /* 표준 그라데이션 */
           -webkit-background-clip: text; /* 크롬, 사파리용 */
           background-clip: text; /* 표준 */
           color: transparent;
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
            padding: 8px 0px; /* 버튼 내부 여백 */
            margin-right: 10px;
            border: none; /* 테두리 없음 */
            border-radius: 10px; 
            font-size: 17px; /* 글꼴 크기 */
            cursor: pointer; /* 클릭 가능하다는 것을 나타내는 커서 */
            transition: background-color 0.3s; /* 호버 효과를 위한 부드러운 전환 */
            width: 350px;
            height: 45px;
            border: 1px solid #c9c9c9;
        }
        
        .driver-post-btn {
            flex-grow: 1; /* 버튼이 동등한 너비 차지 */
            color: white; /* 텍스트 색상 */
            padding: 8px 0px; /* 버튼 내부 여백 */
            border: none; /* 테두리 없음 */
            border-radius: 10px; 
            font-size: 17px; /* 글꼴 크기 */
            cursor: pointer; /* 클릭 가능하다는 것을 나타내는 커서 */
            transition: background-color 0.3s; /* 호버 효과를 위한 부드러운 전환 */
            width: 350px;
            height: 45px;
            border: 1px solid #c9c9c9;

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
            margin-left: 70px;
            display: flex;
            flex-direction: row; 
            align-items: center; 
            justify-content: flex-start; 
          }

          .filter-option {
            cursor: pointer;
            transition: color 0.3s;
            margin-right: 10px;
            background-color: #ffffff;
            color: #779dff;
            padding: 8px 16px; /* Padding */
            border-radius: 20px; /* Rounded corners */
            font-size: 0.9em; /* Text size */
            white-space: nowrap; /* Prevent wrapping */
            cursor: pointer; /* Add cursor pointer */
            border: 1px solid #c9c9c9;
          }

          .filter-option:hover {
            color: #007bff; /* 호버 효과 색상 */
          }

          .outer-post-card {
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border-radius: 8px;
            width: 100%;
            height: 580px;
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
          }

          .profile-image {
            width: 60px; 
            height: 60px;
            border-radius: 50%;
            margin-right: 10px;
          }

          .user-details {
            display: flex;
            flex-direction: column;
          }

          .user-name {
            font-weight: bold;
            display: flex;
            align-items: center;
          }

          .user-role {
            background-color: rgba(28, 92, 255, 0.6); /* 배경색 */
            color: white; /* 텍스트 색상 */
            font-size: 0.8em; /* 글꼴 크기 */
            font-weight: normal; /* 일반체로 설정 */
            border-radius: 20px; /* 원형 모양 */
            padding: 3px 8px; /* 내부 여백 */
            margin-left: 10px; /* 사용자 이름과의 간격 */
          }

          .waiting-for-text {
            font-weight: bold;
            color: blue;
            text-align: right;
            margin-right: 10px;
            margin-top: 15px;
          }

          .post-date {
            margin-left: 30px;
            font-weight: 700;
            color: black;
            margin-bottom: 20px;
          }

          .post-distance {
            margin-left: 20px;
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

          .participant-info {
            position: absolute;
            top: 25px;
            right: 20px;
            background-color: rgba(28, 92, 255, 0.8);
            color: white; 
            padding: 5px 10px;
            border-radius: 10px;
            font-weight: bold;
            font-size: 1rem; 
            display: flex; 
            align-items: center;
            justify-content: center;
            gap: 5px;
          }
          
          .participant-icon {
           width: 22px; /* 아이콘의 너비 */
           height: 22px; /* 아이콘의 높이 */
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
            margin-top: 3px;
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
        
        .post-icon {
         margin-right: 8px; /* 아이콘과 텍스트 사이 간격 조정 */
         width: 22px; /* 아이콘의 너비 조정 */
         height: 22px; /* 아이콘의 높이 조정 */
         vertical-align: middle; /* 텍스트와 수직 정렬 */
        }
        .driver-icon {
         margin-right: 8px; /* 아이콘과 텍스트 사이 간격 조정 */
         width: 22px; /* 아이콘의 너비 조정 */
         height: 22px; /* 아이콘의 높이 조정 */
         vertical-align: middle; /* 텍스트와 수직 정렬 */
        }
        .button-content {
        display: flex;
        align-items: center; /* 수직 정렬 */
        justify-content: center; /* 가로 방향 가운데 정렬 */
        gap: 6px; /* 아이콘과 텍스트 사이 간격 조정 */
        }
        
        .post-details {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-top: 20px;
        }
        .post-fare {
            margin-left: 30px;
            margin-top: 10px;
            margin-bottom: 10px;
            font-weight: 600;
            color: #888888;
          }
        `}
            </style>
        </div>
    );
}

export default Booking;
