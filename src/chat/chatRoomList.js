import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChatRoomList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    
    async function getAllChatRoomNumbers() {
      const userId = getCookieValue('nickname');
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

  const sendNicknameToServer = (roomNumber) => {
    const userId = getCookieValue('id');

    axios.post('/Chat', {
      userId1: userId,
      userId2: roomNumber
    })
    .then(response => {
      navigate(`/chat?userId1=${userId}&userId2=${roomNumber}`); // navigate 함수를 사용하여 페이지를 이동합니다.
      console.log('Nickname sent to server:', response.data);
    })
    .catch(error => {
      console.error('Error sending nickname to server:', error);
    });
  };

  return (
    <div>
      {/* chatRoomNumbers 배열을 사용하여 채팅방 목록을 표시하는 코드 작성 */}
      <ul>
        {users.map((roomNumber, index) => (
          <li key={index}>
            <button onClick={() => sendNicknameToServer(roomNumber)}>
               {roomNumber}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatRoomList;
