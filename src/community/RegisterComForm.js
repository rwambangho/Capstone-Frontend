// RegisterComForm.js
import React from 'react';
import Navbar from '../component/Navbar';
import Sidebar from '../component/Sidebar';
import ContentForm from './ContentForm';
import '../css/RegisterComForm.css';

function RegisterComForm() {
  const handleSaveContent = (content) => {
    
    console.log('Saved content:', content);
    
  };

  return (
    <div className="page-container">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="content-form-container">
          <ContentForm onSaveContent={handleSaveContent} />
        </div>
      </div>
    </div>
  );
}

export default RegisterComForm;
