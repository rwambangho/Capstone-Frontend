import React from 'react';
import { Link } from 'react-router-dom';
import '../css/MyPage.css';
import Navbar from '../component/Navbar';

function MyComments() {
  return (
    <div>
      <Navbar />
      <h1>My Comments</h1>
    </div>
  );
}

export default MyComments;