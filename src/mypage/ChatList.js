import React from 'react';
import { Link } from 'react-router-dom';
import '../css/MyPage.css';
import Navbar from '../component/Navbar';

function ChatList() {
  return (
    <div>
      <Navbar />
      <h1>Chat List</h1>
    </div>
  );
}

export default ChatList;