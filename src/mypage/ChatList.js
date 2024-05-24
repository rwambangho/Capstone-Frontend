import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ChatList() {
  const [chats, setChats] = useState([]);
  const userId1 = '';
  const userId2 = '';

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const response = await axios.get(`/api/chatlist/${userId1}/${userId2}`);

        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chat list:', error);
      }
    };

    fetchChatList();
  }, [userId1, userId2]);

  return (
    <div>
      <h1>Chat List</h1>
      <ul>
        {chats.map((chat) => (
          <li key={chat.chatRoomNumber}>
            <Link to={`/chat?userId1=${chat.userId1}&userId2=${chat.userId2}`}>
              {`Chat with ${chat.userId2}`}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatList;
