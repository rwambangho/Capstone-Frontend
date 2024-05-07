import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import '../css/chatRoom.css';
import Navbar from '../component/Navbar';

function ChatRoom() {
  const location = useLocation();
  const [userId1, setUserId1] = useState('');
  const [userId2, setUserId2] = useState('');
  const [message, setMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [chatRoomNumber, setChatRoomNumber] = useState('');
  const [messages, setMessages] = useState([]);

  const connectWebSocket = (chatRoomNumber) => {
    const socket = new SockJS("/ws", null, { debug: true });
    const stompClient = Stomp.over(socket);
    setStompClient(stompClient);
  
    stompClient.connect({}, function (frame) {
      console.log("웹소켓이 연결됐습니다.");
  
      stompClient.subscribe('/topic/chat/' + chatRoomNumber, function (message) {
        const receivedMessage = JSON.parse(message.body);
        setMessages(prevMessages => [...prevMessages, receivedMessage]);
        console.log(receivedMessage);
        localStorage.setItem(`timestamp_${chatRoomNumber}`, receivedMessage.timestamp);
      });
  
     
    });
  };
  
  const sendMessage = () => {
    const send = (stompClient, chatRoomNumber) => {
      if (stompClient && stompClient.connected) {
        const timestamp = new Date().toISOString();
        const messageToSend = {
          message,
          sender: userId1,
          timestamp
        };
        stompClient.send(`/app/chat/${chatRoomNumber}`, {}, JSON.stringify(messageToSend));
        setMessage('');
      }
    };
  
    send(stompClient, chatRoomNumber);
  };
  
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
          axios.get(`/chat/history/${chatRoomNumber}`)
          .then(response => {
            const previousMessages = response.data.map(item => {
              const { message, userDto: { nickname }, timestamp } = item;
              return { message, sender: nickname, timestamp };
            });
            setMessages(previousMessages);
          })
          .catch(error => {
            console.error('Error fetching chat history:', error);
          });
      
           
            console.log(stompClient);
           
        
            connectWebSocket(chatRoomNumber);
            console.log("웹소켓 연결시도");
          
    
  
        })
        .catch(function (error) {
          console.error('Error fetching chat room number:', error);
        });
    }
  }, []);
  

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return '유효하지 않은 시간';
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

   return (
      <div>
        <Navbar />
        <h1 className="chat-title">Chat Room</h1>
        <div className="chat-container">
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender === userId1 ? 'receiver' : 'sender'}`}>
                <div className="message-sender">{msg.sender === userId1 ? 'Me' : msg.sender}</div>
                <div className="message-text">{msg.message}</div>
                <div className="timestamp">{formatTimestamp(msg.timestamp)}</div>
              </div>
            ))}
          </div>
          <div className="input-area">
            <input
              type="text"
              className="message-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button className="send-button" onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    );
}

export default ChatRoom;
