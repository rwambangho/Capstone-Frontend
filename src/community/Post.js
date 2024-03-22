import React, { useContext } from 'react';
import Navbar from '../component/Navbar';
import Sidebar from '../component/Sidebar';
import { ContentContext } from './ContentContext';

function Post() {
  const { savedContent } = useContext(ContentContext);

  return (
    <div className="page-container">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content-form-container">
          <h2>Post</h2>
          {savedContent && (
            <div>
              <h3>Title:</h3>
              <p>{savedContent.title}</p>
              <h3>Content:</h3>
              <p>{savedContent.content}</p>
              {savedContent.selectedImage && (
                <img src={savedContent.selectedImage} alt="Selected" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
