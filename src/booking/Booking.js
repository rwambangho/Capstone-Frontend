// Booking.js
import React from 'react';
import Navbar from '../component/Navbar';
import Sidebar from '../component/Sidebar';
import '../css/booking/Booking.css';

function Booking() {
    return (
    <div className="page-container">
        <Navbar />
        <div className="main-content">
            <Sidebar />
            <div className="right-content">
                <div className="post-form-header">
                    <h1>Choose the right post for you!</h1>
                    
                    <div className="search-section">
                        <input type="text" className="search-input" placeholder="Search for regions and keywords..." />
                    </div>
                    <div className="filter-section">
                      <button className="filter-btn active">entire</button>
                      <div className="filter-options">
                        <span className="filter-option">Latest</span>
                        <span className="filter-option">Close</span>
                        <span className="filter-option">departure time</span>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Booking;
