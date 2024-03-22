// ContentForm.js

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ContentForm.css';

function ContentForm({ onSaveContent }) { // props 이름을 수정
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleAddPhoto = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = event => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 300;
          canvas.height = (canvas.width / img.width) * img.height;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg');
          setSelectedImage(dataUrl);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    // Save the content
    onSaveContent({ title, content, selectedImage }); // props 이름을 수정
    navigate('/post');
  };

  return (
    <div className="content-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <div className="content-label">
            <label htmlFor="content">Content</label>
            <button type="button" className="add-photo-btn" onClick={handleAddPhoto}>Add photos</button>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
          </div>
          {selectedImage && <img src={selectedImage} alt="Selected" style={{ maxWidth: '100%', marginTop: '10px' }} />}
          <textarea
            id="content"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="register-btn">Register</button>
          <button type="button" className="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default ContentForm; 