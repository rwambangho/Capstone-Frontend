import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../component/Navbar';
import { useNavigate } from 'react-router-dom'; 
import CommunitySidebar from '../component/CommunitySidebar';
import Post from './Post'; // Post 컴포넌트 임포트

import '../css/community/Community.css'

function CommunityMain() {
  const [posts, setPosts] = useState([]);
 
  const navigate = useNavigate();

  function handleButtonClick() {
    // 버튼 클릭 시 이동할 경로 지정
    navigate('/registercomform');
  }


  useEffect(() => {
    axios.get('/community/')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

  }, []);


  return (
    <div className="page-container">
      <Navbar />
      <div className="main-content">
        <CommunitySidebar />
        <div className="content-form-container">
        <button className="write-btn" onClick={handleButtonClick}>Write a Post</button>
            {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
            
        
        </div>
      </div>
    </div>
  );
}

export default CommunityMain;
