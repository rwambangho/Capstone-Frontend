import React, { useState, useEffect } from 'react';
import '../css/Sidebar.css';

function Sidebar() {
  const [posts, setPosts] = useState([]);

  // API로부터 게시글 데이터를 가져오는 것을 모방
  useEffect(() => {
    // 여기서 데이터를 불러오는 API를 호출하고, 응답을 posts 상태에 저장
    // 이 예제에서는 하드코딩된 데이터를 사용
    const fetchedPosts = [
      // 실제 API 응답에서 받은 게시글 데이터
    ];
    setPosts(fetchedPosts);
  }, []); // 빈 배열은 컴포넌트가 마운트될 때만 useEffect를 실행하게 함

  return (
    <div className="sidebar">
      <div className="sidebar-header">Real-time popular posts</div>
      <ul className="posts-list">
        {posts.map((post, index) => (
          <li key={index} className="post-item">{post.title}</li>
        ))}
      </ul>
      <div className="search-container">
        <input type="text" className="search-input" placeholder="search..." />
      </div>
    </div>
  );
}

export default Sidebar;