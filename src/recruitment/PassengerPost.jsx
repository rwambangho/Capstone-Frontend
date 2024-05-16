//PassengerPost.jsx
import PassengerIcon from '../icons/icon.svg';
import DriverIcon from '../icons/driver.svg';
import GrayPassengerIcon from '../icons/grayicon.svg';
import GrayDriverIcon from '../icons/graydriver.svg';
import ParticipantIcon from '../icons/participant.svg';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';
import Sidebar from '../component/Sidebar';
import axios from 'axios';
import Kakao from './Kakao';
const { kakao } = window;



function PassengerPost() {
    const navigate = useNavigate();
    const [departure, setDeparture] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false); // 검색 결과를 표시할 지 여부를 추적하는 상태를 추가
    const [message, setMessage] = useState('');
    const [nickname, setNickname] = useState(getCookieValue('id') || 'User');
    const [isDriverPost] = useState(false);
    const [departurePlaces, setDeparturePlaces] = useState([]);
    const [arrivalPlaces, setArrivalPlaces] = useState([]);
    const [selectedDeparturePlace, setSelectedDeparturePlace] = useState({ name: "", address: "", x: "", y: "" });
    const [selectedArrivalPlace, setSelectedArrivalPlace] = useState({ name: "", address: "", x: "", y: "" });
    const [avgStar, setAvgStar] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 상태를 관리
    const ps = new kakao.maps.services.Places();
    const [passengerButtonActive, setPassengerButtonActive] = useState(true);
    const [driverButtonActive, setDriverButtonActive] = useState(false);


    useEffect(() => {
        const fetchUserRating = async () => {
            const userId = getCookieValue('id');
            if (userId) {
                try {
                    const response = await axios.get(`/user/getUser/${userId}`);
                    setNickname(response.data.nickname);
                    setAvgStar(response.data.avgStar);
                } catch (error) {
                    console.error('Failed to fetch user rating:', error);
                }
            }
        };

        fetchUserRating();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/recruits', {
                title: 'Passenger Post',
                contents: `${departure} to ${destination} at ${date} ${time}`,
                nickname: nickname,
                departure: departure,
                destination: destination,
                departureDate: date,
                isDriverPost: false,
                keywords: selectedKeywords,
                message: message,
                avgStar: avgStar,
                departureX: selectedDeparturePlace.x,
                departureY: selectedDeparturePlace.y,
                arrivalX: selectedArrivalPlace.x,
                arrivalY: selectedArrivalPlace.y
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

    const handleKeywordClick = (keyword) => {
        if (selectedKeywords.includes(keyword)) {
            setSelectedKeywords(selectedKeywords.filter((kw) => kw !== keyword));
        } else {
            if (selectedKeywords.length < 3) {
                setSelectedKeywords([...selectedKeywords, keyword]);
            } else {
                alert("You can select up to 3 keywords.");
            }
        }
    };

    const handleRemoveKeyword = (removedKeyword) => {
        setSelectedKeywords(selectedKeywords.filter((keyword) => keyword !== removedKeyword));
    };

    const handleKeywordChange = (event) => {
        const selectedOption = event.target.value;
        if (selectedKeywords.length < 3) {
            setSelectedKeywords([...selectedKeywords, selectedOption]);
            setShowSearchResults(true); // 키워드를 선택하면 검색 결과를 표시합니다.
        } else {
            alert("최대 3개의 키워드를 선택할 수 있습니다.");
        }
    };

    const searchDeparturePlaces = (keyword) => {
        if (!keyword.replace(/^\s+|\s+$/g, '')) {
            return false;
        }

        ps.keywordSearch(keyword, departurePlacesSearchCB);
    };

    const departurePlacesSearchCB = (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
            const mappedPlaces = data.map(place => ({
                name: place.place_name,
                address: place.address_name,
                x: place.x,
                y: place.y
            }));
            setDeparturePlaces(mappedPlaces);
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            alert('검색 결과가 존재하지 않습니다.');
            return;
        } else if (status === kakao.maps.services.Status.ERROR) {
            alert('검색 결과 중 오류가 발생했습니다.');
            return;
        }
    };

    const searchArrivalPlaces = (keyword) => {
        if (!keyword.replace(/^\s+|\s+$/g, '')) {
            return false;
        }

        ps.keywordSearch(keyword, arrivalPlacesSearchCB);
    };

    const arrivalPlacesSearchCB = (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
            const mappedPlaces = data.map(place => ({
                name: place.place_name,
                address: place.address_name,
                x: place.x,
                y: place.y
            }));
            setArrivalPlaces(mappedPlaces);
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            alert('검색 결과가 존재하지 않습니다.');
            return;
        } else if (status === kakao.maps.services.Status.ERROR) {
            alert('검색 결과 중 오류가 발생했습니다.');
            return;
        }
    };

    const handleDeparturePlaceClick = (place) => {
        setSelectedDeparturePlace(place);
        document.getElementById('departure').value = `${place.name}`;
    };

    const handleArrivalPlaceClick = (place) => {
        setSelectedArrivalPlace(place);
        document.getElementById('arrival').value = `${place.name}`;
    };

    const handleDepartureSubmit = (event) => {
        selectedDeparturePlace.name = "";
        event.preventDefault();
        const keyword = document.getElementById('departure').value;
        searchDeparturePlaces(keyword);
    };

    const handleArrivalSubmit = (event) => {
        selectedArrivalPlace.name = "";
        event.preventDefault();
        const keyword = document.getElementById('arrival').value;
        searchArrivalPlaces(keyword);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen); // 드롭다운의 열림/닫힘 상태를 토글합니다.
    };

    return (
        <div className="page-container">
            <style>
                {`
          .main-content {
            flex-grow: 1;
            display: flex;
            padding: 20px;
            margin-right: 300px;
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
            border-top: 1px solid #ccc;
            margin-bottom: 30px;
        }
        
        .form-container {
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            padding: 40px;
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
        
        .content-container {
            max-width: 100%;
            margin: 0 auto;
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
        
        .input-group {
            display: flex;
            flex-direction: column;
            margin-bottom: 20px; /* 각 그룹 사이의 공간 추가 */
        }
        
        .input-group label {
            display: block;
            margin-bottom: 10px;
            text-align: left;
            margin-right: 10px;
            font-size: 16px;
            color: #333;
        }
        
        .input-group input {
            background-color: #f0f0f0;
            border-radius: 5px;
            border: 1px solid #ccc;
            padding: 8px;
            width: 650px;
        }
        
        
        .input-group textarea,
        .input-group select {
            background-color: #f0f0f0;
            border-radius: 5px;
            border: 1px solid #ccc;
            padding: 8px;
            width: 100%;
        }
        
        .input-group button {
            background-color: #5cb85c;
            color: #fff;
            border: none;
            border-radius: 5px;
            padding: 8px 15px;
            margin-left: 750px;
            margin-top: -35px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            width: 80px;
            height: 30px;
        }
        
        .input-group button:hover,
        .register-button:hover {
            background-color: #4cae4c;
        }

        .input-group button:disabled,
        .register-button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
        
        .input-group date-time-container input{
            flex: 1;
            justify-content: space-between;
        }
        
        .date-time-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .date-input-container,
        .time-input-container {
            flex: 1;
            margin-right: 10px;
        }

        .date-input-container:last-child,
        .time-input-container:last-child {
            margin-right: 0;
        }

        .date-input-container input,
        .time-input-container input {
            width: 650px;
            height: 18px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 8px;
            margin-bottom: 10px;
        }
        
        .message-container textarea {
            height: 120px;
            resize: none;
        }
        
       

        .input-group.keywords .keyword {
            display: inline-block; /* 키워드를 수평으로 표시 */
            margin-right: 15px; /* 각 키워드 사이의 간격 조정 */
            margin-top: 5px;
            padding: 4px 10px; /* 키워드 간격을 좀 더 조정하기 위해 패딩 추가 */
            background-color: #5bc0de;
            color: #fff;
            border-radius: 22px;
            
        }
        
       .selected-keywords {
           justify-content: center; /* 가로 방향 가운데 정렬 */
           align-items: center; /* 세로 방향 가운데 정렬 */
           flex-wrap: wrap; /* 키워드가 넘칠 경우 자동으로 줄 바꿈 */
           margin-top: 10px;
          
       }

.keyword {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px; /* 각 키워드 사이의 간격 조정 */
    margin-bottom: 5px; /* 아래쪽 간격 추가 */
    border-radius: 22px;
    background-color: #5bc0de;
    }

.keyword button {
    background-color: transparent;
    border: none;
    color: #fff;
    cursor: pointer;
    margin-left: -20px;
    margin-right: -20px; 
   
}

.keyword button:hover {
    background-color: transparent;
}

.keyword button:focus {
    outline: none;
}
      
        .max-participants-input {
            margin-bottom: 20px;
        }
    
        .max-participants-input input {
            background-color: #f0f0f0;
            border-radius: 5px;
            border: 1px solid #ccc;
            padding: 10px;
            width: 100%;
        }
    
        .register-button {
            background-color: #5cb85c;
            color: #fff;
            border: none;
            border-radius: 5px;
            padding: 12px 20px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
    
        .register-button:hover {
            background-color: #4cae4c;
        }
    
        .register-button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
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
        `}
            </style>
            <Navbar />
            <div className="main-content" style={{ display: 'flex' }}>
                <div className="right-content">
                    <div className="post-form-header">
                        <h1>Please select the post that suits you</h1>
                        <div className="post-buttons">
                            <button
                                className={`passenger-post-btn ${passengerButtonActive ? 'active' : ''}`}
                                onClick={() => {
                                    navigate('/carpool-recruitment-passenger')
                                    setPassengerButtonActive(true);
                                    setDriverButtonActive(false);
                                }}
                            >
                                <div className="button-content">
                                    <img src={passengerButtonActive ? PassengerIcon : GrayPassengerIcon}
                                         alt="Passenger Icon" className="post-icon"/>
                                    Passenger's post
                                </div>
                            </button>
                            <button
                                className={`driver-post-btn ${driverButtonActive ? 'active' : ''}`}
                                onClick={() => {
                                    navigate('/carpool-recruitment-driver')
                                    setPassengerButtonActive(false);
                                    setDriverButtonActive(true);
                                }}
                            >
                                <div className="button-content">
                                    <img src={driverButtonActive ? DriverIcon : GrayDriverIcon} alt="Driver Icon"
                                         className="post-icon"/>
                                    Driver's post
                                </div>
                            </button>

                        </div>
                    </div>
                    <div className="form-container">
                        <div className="form-title">
                            <h2>Write as a Passenger</h2>
                            <hr/>
                            <form onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <label>Point of Departure</label>
                                    <input
                                        type="text"
                                        id="departure"
                                        onChange={(e) => setDeparture(e.target.value)}
                                        placeholder="fill in your point of departure"
                                        required
                                    />
                                    <button onClick={handleDepartureSubmit}>Search</button>
                                </div>
                                <div>
                                    {departurePlaces.length > 0 && selectedDeparturePlace.name === "" && (
                                        <ul className="search-results">
                                            {departurePlaces.map((place, index) => (
                                                <li key={index} onClick={() => handleDeparturePlaceClick(place)}>
                                                    <strong>{place.name}</strong>: <span>{place.address}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className="input-group">
                                    <label>Destination</label>
                                    <input
                                        type="text"
                                        id="arrival"
                                        onChange={(e) => setDestination(e.target.value)}
                                        placeholder="fill in your Destination"
                                        required
                                    />
                                    <button onClick={handleArrivalSubmit}>Search</button>
                                </div>
                                <div>
                                    {arrivalPlaces.length > 0 && selectedArrivalPlace.name === "" && (
                                        <ul className="search-results">
                                            {arrivalPlaces.map((place, index) => (
                                                <li key={index} onClick={() => handleArrivalPlaceClick(place)}>
                                                    <strong>{place.name}</strong>: <span>{place.address}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className="input-group date-time-container">
                                    <div className="date-input-container">
                                        <label>Date of departure</label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="time-input-container">
                                        <label>Time of departure</label>
                                        <input
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="input-group keywords">
                                    <label>Keywords</label>
                                    <select
                                        value=""
                                        onChange={handleKeywordChange}
                                        onFocus={toggleDropdown} // 입력 칸이 클릭되면 드롭다운 열기
                                    >
                                        <option value="" disabled hidden>Choose keywords</option>
                                        <option value="뒷자리희망">뒷자리희망</option>
                                        <option value="펫동반">펫동반</option>
                                        <option value="소량짐">소량짐</option>
                                        <option value="음주탑승">음주탑승</option>
                                        <option value="동승가능">동승가능</option>
                                        <option value="시간협의">시간협의</option>
                                        <option value="비용협의">장거리</option>
                                        <option value="장거리">비용협의</option>
                                    </select>
                                    <div className="selected-keywords">
                                        {selectedKeywords.map((keyword, index) => (
                                            <div key={index} className="keyword">
                                                <span>{keyword}</span>
                                                <button onClick={() => handleRemoveKeyword(keyword)}>x</button>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                                <div className="input-group message-container">
                                    <label>What you want to tell</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Enter your message here."
                                        required
                                    />
                                </div>
                                <div className="max-participants-input">
                                    {/* Your max participants input field */}
                                </div>
                                <button type="submit" className="register-button">
                                    Register
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PassengerPost;
