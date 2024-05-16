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
  const [keywords, setKeywords] = useState([]);
  const [message, setMessage] = useState('');
  const [nickname, setNickname] = useState(getCookieValue('id') || 'User');
  const [driverPost]=useState(false);
  const [departurePlaces, setDeparturePlaces] = useState([]);
  const [arrivalPlaces, setArrivalPlaces] = useState([]);
  const [selectedDeparturePlace, setSelectedDeparturePlace] = useState({ name: "", address: "", x: "", y: "" });
  const [selectedArrivalPlace, setSelectedArrivalPlace] = useState({ name: "", address: "", x: "", y: "" });
 

    const ps = new kakao.maps.services.Places();


    useEffect(() => {
      const fetchUserRating = async () => {
        const userId = getCookieValue('id');
        if (userId) {
          try {
            const response = await axios.get(`/user/getUser/${userId}`);
            setNickname(response.data.nickname);
            
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
        driverPost: driverPost,
        keywords: keywords,
        message : message,
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

  const handleKeywordChange = (event) => {
    if (event.key === 'Enter' && event.target.value.trim() !== '') {
      setKeywords([...keywords, event.target.value]);
      event.target.value = '';
    }
  };

  const removeKeyword = (index) => {
    setKeywords(keywords.filter((_, idx) => idx !== index));
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

    console.log(departurePlaces);
    document.getElementById('departure').value=`${place.name}`;
   
  
  };

const handleArrivalPlaceClick = (place) => {
    setSelectedArrivalPlace(place);
    document.getElementById('arrival').value=`${place.name}`;
    
  };

const handleDepartureSubmit = (event) => {
    selectedDeparturePlace.name="";
    event.preventDefault();
    const keyword = document.getElementById('departure').value;
    searchDeparturePlaces(keyword);
    
    
};

const handleArrivalSubmit = (event) => {
    selectedArrivalPlace.name="";
    event.preventDefault();
    const keyword = document.getElementById('arrival').value;
    searchArrivalPlaces(keyword);
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
            border-top: 1px solid #ccc;
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
            padding: 40px;
        }
        
        .right-content {
            flex-grow: 1;
            padding: 20px;
            max-width: calc(100% - 250px);
            margin-right: 250px;
            box-sizing: border-box;
        }
        
        .post-form-header {
            text-align: center;
            margin-bottom: 20px;
        }
        
        .content-container {
            max-width: 100%;
            margin: 0 auto;
        }
        
        .post-buttons {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
        }
        
        .passenger-post-btn,
        .driver-post-btn {
            border: none;
            background-color: #5bc0de;
            border-radius: 20px;
            color: #fff;
            padding: 10px 20px;
            margin: 0 10px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        .passenger-post-btn:hover,
        .driver-post-btn:hover {
            background-color: #31b0d5;
        }
        
        .input-group input,
        .input-group textarea {
            background-color: #f0f0f0;
            border-radius: 5px;
            border: 1px solid #ccc;
            padding: 10px;
            width: 100%;
        }
        
        .input-group button {
            background-color: #5cb85c;
            color: #fff;
            border: none;
            border-radius: 5px;
            padding: 8px 15px;
            margin-left: 10px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        .input-group button:hover {
            background-color: #4cae4c;
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
        
        .message-container textarea {
            height: 120px;
            resize: none;
        }
        
        .keywords {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
        }
        
        .keyword {
            background-color: #5bc0de;
            color: #fff;
            border-radius: 22px;
            padding: 0 10px;
            display: flex;
            align-items: center;
            gap: 3px;
        }
        
        .keyword button {
            background-color: transparent;
            border: none;
            color: #fff;
            cursor: pointer;
        }
        
        .keyword button:hover {
            color: #ccc;
        }
        
        .keyword button:focus {
            outline: none;
        }
        .search-results {
          list-style: none;
          padding: 0;
      }
      
      .search-results li {
          padding: 10px;
          background-color: #f5f5f5;
          border-radius: 5px;
          margin-bottom: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
      }
      
      .search-results li:hover {
          background-color: #e5e5e5;
      }
      
      .search-results li strong {
          color: #333;
      }
      
      .search-results li span {
          color: #666;
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
    
      

        `}
        </style>
        <Navbar />
        <div className="main-content" style={{ display: 'flex' }}>
          <Sidebar />
          <div className="right-content">
            <div className="post-form-header">
              <h1>Select the right post for you!</h1>
              <div className="post-buttons">
              <button onClick={() => navigate('/carpool-recruitment-passenger')} className="passenger-post-btn">Passenger's post</button>
                <button onClick={() => navigate('/carpool-recruitment-driver')} className="driver-post-btn">Driver's post</button>
              </div>
            </div>
            <div className="form-container">
              <div className="form-title">
                <h2>Write as a Passenger</h2>
                <hr />

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
  <button onClick={handleDepartureSubmit}>검색하기</button>
</div>
<div>
  {departurePlaces.length > 0 && selectedDeparturePlace.name === "" &&(
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
  <button onClick={handleArrivalSubmit}>검색하기</button>
</div>
<div>
  {arrivalPlaces.length > 0 && selectedArrivalPlace.name===""&&(
    <ul className="search-results">
      {arrivalPlaces.map((place, index) => (
        <li key={index} onClick={() => handleArrivalPlaceClick(place)}>
          <strong>{place.name}</strong>: <span>{place.address}</span>
        </li>
      ))}
    </ul>
  )}
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
                  <div className="max-participants-input">
  
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
