import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/chatRoomList.css';

const StarRating = ({ rating }) => {
  console.log(rating);
  const totalStars = 5;
  let stars = [];
  for (let i = 1; i <= totalStars; i++) {
      stars.push(
          <span key={i} style={{ color: i <= rating ? 'gold' : 'gray' }}>★</span>
      );
  }
  return <div>{stars}</div>;
};

function ChatRoomList({ handleQueryParams }) {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('Passenger'); // 역할 상태 추가
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가
  const [activeUser, setActiveUser] = useState(null); // 클릭한 닉네임 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    async function getAllChatRoomNumbers() {
      const userId = getCookieValue('id');
      console.log(userId);
      try {
        const response = await axios.get('/getAllChatRoomNumber', {
          params: {
            userId: userId
          }
        });
        console.log('Chat Room Numbers:', response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching chat room numbers:', error);
      }
    }

    getAllChatRoomNumbers();
  }, []);

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
  function filterUsersBySearchTerm() {
    return users.filter(user => user.nickname.toLowerCase().includes(searchTerm.toLowerCase()));
  }


  const sendNicknameToServer = (roomNumber) => {
    const userId = getCookieValue('nickname');
    console.log("이름1" + roomNumber);
    console.log("이름2" + userId);

    const userId1 = `${userId}`;
    const userId2 = `${roomNumber}`;

    handleQueryParams(userId1, userId2);
    setActiveUser(roomNumber); // 클릭한 닉네임을 활성화 상태로 설정
  };

  



  return (
      <div className="chatting-container">
        <h2 className="chatting-title">Chatting list</h2>
        <div className="chat-room-list">
          <div className="search-container">
            <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="searchh-input"
            />
          </div>
          <ul className="chat-room-list-ul">
          {filterUsersBySearchTerm().map((roomNumber, index) => (
            <li
              key={index}
              className={`chat-room-list-li ${activeUser === roomNumber.nickname ? 'active' : ''}`}
              onClick={() => sendNicknameToServer(roomNumber.nickname)}
            >
              {roomNumber.nickname}
              <StarRating rating={roomNumber.avgStar} />
              {roomNumber.profileImage ? (
                <img src={roomNumber.profileImage.replace('/home/ubuntu/images', '/images')} alt="Profile"
                  style={{width: '100%', height: '100%', borderRadius: '50%'}}/>
              ) : null}
            </li>
          ))}
        </ul>
        </div>
      </div>
  );
}

export default ChatRoomList;