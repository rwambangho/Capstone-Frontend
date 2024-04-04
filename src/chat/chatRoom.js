import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

function ChatRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userId1, setUserId1] = useState('');
  const [userId2, setUserId2] = useState('');
  const [message, setMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [chatRoomNumber, setChatRoomNumber] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const userId1Param = searchParams.get('userId1');
    const userId2Param = searchParams.get('userId2');
    
    if (userId1Param && userId2Param) {
      setUserId1(userId1Param);
      setUserId2(userId2Param);

      axios.post('/Chat', {
        userId1: userId1Param,
        userId2: userId2Param
      })
      .then(function (response) {
        const chatRoomNumber = response.data;
        setChatRoomNumber(chatRoomNumber);

        const socket = new SockJS("/ws");
        const stompClient = Stomp.over(socket);
        setStompClient(stompClient);

        stompClient.connect({}, function(frame) {
          console.log('Connected: ' + frame);

          stompClient.subscribe('/topic/chat/' + chatRoomNumber, function(message) {
            console.log('Message: ' + message.body);
            const receivedMessage = JSON.parse(message.body);
            if (!messages.some(msg => msg.message === receivedMessage.message && msg.sender === receivedMessage.sender)) {
              setMessages(prevMessages => [...prevMessages, receivedMessage]);
            }
          });
        });

        // 채팅방 번호가 설정된 후 이전 메시지 내역을 불러옵니다.
        axios.get(`/chat/history/${chatRoomNumber}`)
        .then(response => {
          const previousMessages = response.data.map(item => {
            // 각 객체에서 message와 userDto의 id를 추출합니다.
            const { message, userDto: { id } } = item;
            return { message, sender: id }; // 메시지와 발신자(id) 정보를 가진 객체로 변환합니다.
          });
      
          // 추출된 메시지 목록을 상태에 설정합니다.
          setMessages(previousMessages);// 이전 메시지들로 메시지 상태를 초기화합니다.
        })
        .catch(error => {
            console.error('Error fetching chat history:', error);
        });
      })
      .catch(function (error) {
        console.error('Error fetching chat room number:', error);
      });
    }

  }, [location.search, chatRoomNumber, userId1, userId2]); 

  const sendMessage = () => {
    if (stompClient && stompClient.connected) { // 연결된 상태에서만 메시지 전송
      stompClient.send(`/app/chat/${chatRoomNumber}`, {}, JSON.stringify({ message, sender: userId1 }));
      setMessage('');
    }
  };

  return (
    <div>
      <h1>Chat Room</h1>
      <div>
        <div>
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.sender}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatRoom;