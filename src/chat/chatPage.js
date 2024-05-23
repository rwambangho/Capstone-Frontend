import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ChatRoomList from './chatRoomList';
import Navbar from '../component/Navbar';
import ChatRoom from './chatRoom';

const ChatPageContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const ChatRoomListContainer = styled.div`
  flex: 0.6;
  overflow-y: auto;
  border-right: 1px solid #ccc;
`;

const ChatRoomContainer = styled.div`
  flex: 2;
  overflow-y: auto;
`;

function ChatPage() {
    const [selectedRoom, setSelectedRoom] = useState({ userId1: '', userId2: '' });

    useEffect(() => {
        console.log(selectedRoom.userId1);
        console.log(selectedRoom.userId2);
    }, [selectedRoom.userId1, selectedRoom.userId2]);

    const handleQueryParams = (userId1, userId2) => {
        setSelectedRoom({
            userId1: userId1,
            userId2: userId2,
        });
    };

    return (
        <div>
            <Navbar />
            <ChatPageContainer>
                <ChatRoomListContainer>
                    <ChatRoomList handleQueryParams={handleQueryParams} />
                </ChatRoomListContainer>
                <ChatRoomContainer>
                    {selectedRoom.userId1 !== '' && selectedRoom.userId2 !== '' && (
                        <ChatRoom param1={selectedRoom.userId1} param2={selectedRoom.userId2} showTitle={false} />
                    )}
                </ChatRoomContainer>
            </ChatPageContainer>
        </div>
    );
}

export default ChatPage;