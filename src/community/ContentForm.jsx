import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/community/ContentForm.css';

function ContentForm({ onRegister }) {
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
          canvas.width = 150; // 이미지 너비를 150px로 조정
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
      formData.append('time', new Date().toISOString());
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await axios.post('/api/community/save', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Response from server:', response.data);

      // 등록된 글을 상위 컴포넌트로 전달
      onRegister(response.data);

      // 제출 후에 /post로 이동
      navigate('/community');
    } catch (error) {
      console.error('Error saving content:', error);
      navigate('/community');
    }
  };

  return (
      <div className="content-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group title-group">
            <label htmlFor="title">Title</label>
            <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group content-group">
            <div className="content-label">
              <label htmlFor="content" className="content-label-text">Content</label>
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
                <img src={selectedImage} alt="Selected" className="uploaded-image" />
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
            <button type="button" className="cancel-btn" onClick={() => navigate('/community')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
  );
}

export default ContentForm;