// RegisterComForm.jsx
import React from 'react';
import Navbar from '../component/Navbar';
import CommunitySidebar from '../component/CommunitySidebar';
import ContentForm from './ContentForm';
import '../css/RegisterComForm.css';

function RegisterComForm() {
    const handleSaveContent = (content) => {

        console.log('Saved content:', content);

    };

    return (
        <div className="page-container">
            <Navbar />
            <CommunitySidebar />
            <div className="main-content">
                <div className="content-form-container">

                    <ContentForm onSaveContent={handleSaveContent} />
                </div>
            </div>
        </div>
    );
}

export default RegisterComForm;