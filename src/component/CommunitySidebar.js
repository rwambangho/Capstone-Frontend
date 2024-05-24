import React, { useState, useEffect } from 'react';
import '../css/Sidebar.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CommunitySidebar() {
  const [popularPosts, setPopularPosts] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태 추가
  const navigate = useNavigate();
 
  const navigateToPostDetail = (postId) => { // postId 매개변수 추가
    axios.put('/api/community/addClickCount', {
        id: postId
    })
        .then(response => {
            console.log('PUT request successful:', response.data);
            navigate(`/post/${postId}`); // postId를 매개변수로 전달하여 네비게이션
        })
        .catch(error => {
            console.error('Error sending PUT request:', error);
        });
  };

  useEffect(() => {
    axios.get('/api/community/PopularCommunity')
      .then(response => {
        const titles = response.data.map(item => ({ id: item.id, title: item.title }));
        setPopularPosts(titles);
      })
      .catch(error => {
        console.error('Error fetching popular data:', error);
      });
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    axios.get(`/api/community/search?title=${encodeURIComponent(searchInput)}`)
      .then(response => {
        setSearchResults(response.data); // 검색 결과 저장
      })
      .catch(error => {
        console.error('Error during search:', error);
      });
    setSearchInput('');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">Real-time popular posts</div>
      <div className="posts-list">
        {popularPosts.map(post => (
          <div key={post.id} className="popular-post">
            <Link to={`/post/${post.id}`} className="post-link">{post.title}</Link>
          </div>
        ))}
      </div>
      <div className="search-container">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="search-input"
            placeholder="search..."
            value={searchInput}
            onChange={handleSearchInputChange}
          />
        </form>
        {/* 검색 결과 렌더링 */}
        <div className="search-results">
          {searchResults.map((result) => (
            <div key={result.id} className="search-result-item">
              <button onClick={navigateToPostDetail(result.id)}>{result.title}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommunitySidebar;
