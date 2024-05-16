import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChatRoomList({ handleQueryParams }) {
  const [users, setUsers] = useState([]);
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

  const sendNicknameToServer = (roomNumber) => {
    const userId = getCookieValue('nickname');
    console.log("이름1"+roomNumber);
    console.log("이름2"+userId);

   
        
            const userId1= `${userId}`;
            const userId2=`${roomNumber}`
            
            handleQueryParams(userId1,userId2);
        
     
};

  return (
      <div>
        {/* chatRoomNumbers 배열을 사용하여 채팅방 목록을 표시하는 코드 작성 */}
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {users.map((roomNumber, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <button
                  style={{
                    backgroundColor: '#4CAF50',
                    border: 'none',
                    color: 'white',
                    padding: '15px 32px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'inline-block',
                    fontSize: '16px',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
                    transition: '0.3s',
                  }}
                  onClick={() => sendNicknameToServer(roomNumber)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
                >
                  {roomNumber}
                </button>
              </li>
          ))}
        </ul>
      </div>
  );
}

export default ChatRoomList;
