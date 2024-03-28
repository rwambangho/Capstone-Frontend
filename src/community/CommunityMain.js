import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../component/Navbar';
import Sidebar from '../component/Sidebar';
import Post from './Post'; // Post 컴포넌트 임포트

function CommunityMain() {
  const [posts, setPosts] = useState([]);

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
        <Sidebar />
        <div className="content-form-container">
 
            {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
            
        
        </div>
      </div>
    </div>
  );
}

export default CommunityMain;
