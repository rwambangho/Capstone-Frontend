// ContentForm.js
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/ContentForm.css';

function ContentForm({ onSaveContent }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleAddPhoto = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      
      const response = await axios.post('/community/save', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Response from server:', response.data);
      
      // 제출 후에 onSaveContent 콜백 호출하여 데이터 전달
      onSaveContent(response.data);

      // 제출 후에 /post로 이동
      navigate('/post');
    } catch (error) {
      console.error('Error saving content:', error);
      navigate('/');
    }
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
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <div className="content-label">
            <label htmlFor="content">Content</label>
            <button type="button" className="add-photo-btn" onClick={handleAddPhoto}>
              Add photos
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
          </div>
          {selectedImage && (
            <img src={selectedImage} alt="Selected" style={{ maxWidth: '100%' }} />
          )}
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="register-btn">
            Register
          </button>
          <button type="button" className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContentForm;
