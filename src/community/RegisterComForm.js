// RegisterComForm.js

import React, { useState, useContext } from 'react';
import Navbar from '../component/Navbar';
import Sidebar from '../component/Sidebar';
import ContentForm from './ContentForm';
import '../css/RegisterComForm.css';
import { ContentContext } from './ContentContext';

function RegisterComForm() {
  const { savedContent, setSavedContent } = useContext(ContentContext); // useContext 훅을 사용하여 Context에서 상태 및 상태 변경 함수를 가져옴

  const handleSaveContent = content => {
    setSavedContent(content); // 저장된 내용 설정
  };

  return (
    <div className="page-container">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content-form-container">
          <ContentForm onSaveContent={handleSaveContent} /> {/* onSaveContent 함수를 props로 전달 */}
        </div>
      </div>
    </div>
  );
}

export default RegisterComForm;
