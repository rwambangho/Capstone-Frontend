import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import '../css/chatRoom.css';
import Navbar from '../component/Navbar';

function ChatRoom({ param1, param2 }) {
    const location = useLocation();

    const [selectedRoom, setSelectedRoom] = useState({ userId1: '', userId2: '' });
    const [message, setMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [chatRoomNumber, setChatRoomNumber] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesContainerRef = useRef(null); // 메시지 컨테이너에 대한 참조

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
        if (stompClient && stompClient.connected) {
            const timestamp = new Date().toISOString();
            const messageToSend = {
                message,
                sender: selectedRoom.userId1,
                timestamp
            };
            stompClient.send(`/app/chat/${chatRoomNumber}`, {}, JSON.stringify(messageToSend));
            setMessage('');
        } else {
            console.error('WebSocket is not connected yet.');
            alert('WebSocket is not connected yet.');
        }
    };

    useEffect(() => {
        console.log(param1);
        console.log(param2);

        if (param1 !== undefined && param2 !== undefined) {
            console.log("props로 전달");
            setSelectedRoom({
                userId1: param1,
                userId2: param2
            });
        } else {
            console.log("쿼리문으로 전달");
            const searchParams = new URLSearchParams(location.search);
            const userId1Param = searchParams.get('userId1');
            const userId2Param = searchParams.get('userId2');
            setSelectedRoom({
                userId1: userId1Param,
                userId2: userId2Param
            });
        }
    }, [param1, param2]);

    useEffect(() => {
        if (selectedRoom.userId1 !== '' && selectedRoom.userId2 !== '') {
            console.log("selectedRoom 업데이트");
            axios.post('/api/Chat', {
                userId1: selectedRoom.userId1,
                userId2: selectedRoom.userId2
            })
                .then(function (response) {
                    const chatRoomNumber = response.data;
                    setChatRoomNumber(chatRoomNumber);

                    axios.get(`/api/chat/history/${chatRoomNumber}`)
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
    }, [selectedRoom]);

    useEffect(() => {
        // 메시지가 변경될 때마다 메시지 컨테이너 끝으로 스크롤
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

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
            <div className="chat-container">
                <div className="messages-container" ref={messagesContainerRef}> {/* 메시지 컨테이너에 대한 참조 추가 */}
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender === selectedRoom.userId1 ? 'receiver' : 'sender'}`}>
                            <div className="message-sender">{msg.sender === selectedRoom.userId1 ? 'Me' : msg.sender}</div>
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
                        onKeyDown={handleKeyDown} // 엔터키 입력 이벤트 리스너 변경
                        placeholder="Type a message..."
                    />
                    <button className="send-button" onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default ChatRoom;