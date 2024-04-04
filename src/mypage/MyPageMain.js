import React from 'react';
import { Link } from 'react-router-dom';
import '../css/MyPage.css';
import Navbar from '../component/Navbar';

function MyPageMain() {
  return (
    <div className="my-page-main">
      <Navbar />
      <div className="my-page">
        <Link to="/mypage/signupInformation">Sign-up information</Link><br  />
        <Link to="/mypage/carpoolRecords">Recent carpooling records</Link><br  />
        <Link to="/mypage/myPosts">My Post list</Link><br  />
        <Link to="/mypage/myComments">My Comment list</Link><br  />
        <Link to="/mypage/chatList">Chatting list</Link>
      </div>
    </div>
  );
}

export default MyPageMain;
