import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../component/Navbar';
import Sidebar from '../component/Sidebar';

function Post() {
  const [communityData, setCommunityData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/community/data');
        setCommunityData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="page-container">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content-form-container">
          {communityData && (
            <div>
              {communityData.map(item => (
                <div key={item.id}>
                  <h2>Post</h2>
                  <div>
                    <h3>Title:</h3>
                    <p>{item.title}</p>
                    <h3>Content:</h3>
                    <p>{item.content}</p>
                    <img src={item.image} alt="Community Image" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;