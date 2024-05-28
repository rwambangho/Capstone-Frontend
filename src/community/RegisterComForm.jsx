import React from 'react';
import Navbar from '../component/Navbar';
import CommunitySidebar from '../component/CommunitySidebar';
import ContentForm from './ContentForm';
import '../css/RegisterComForm.css';

function RegisterComForm() {
    const handleSaveContent = (content) => {
        console.log('Saved content:', content);
    };

    const sidebarStyle = {
        marginLeft: '20px',
        marginTop: '80px',
    };

    const mediaQueryStyle = `
        @media (max-width: 768px) {
            .page-container {
                flex-direction: column;
            }
            .community-sidebar {
                margin-left: 0;
                margin-top: 0;
            }
            .content-form-container {
                margin-left: 0;
                margin-top: 20px;
            }
        }
    `;

    return (
        <div>
            <style>{mediaQueryStyle}</style>
            <div className="page-container">
                <Navbar />
                <div className="main-content">
                    <div style={sidebarStyle}>
                        <CommunitySidebar />
                    </div>
                    <div className="content-form-container">
                        <ContentForm onRegister={handleSaveContent} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterComForm;
