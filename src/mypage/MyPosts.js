import React from 'react';
import { Link } from 'react-router-dom';
import '../css/MyPage.css';
import Navbar from '../component/Navbar';

function MyPosts() {
  return (
    <div>
      <Navbar />
      <h1>My Posts</h1>
    </div>
  );
}

export default MyPosts;
