import React, { useState, useEffect } from 'react';
import Navbar from '../component/Navbar';
import Sidebar from '../component/Sidebar';
import axios from 'axios';
import '../css/booking/Booking.css';
import Passenger1 from '../recruitment/Passenger1';
import { useNavigate } from 'react-router-dom'; // useHistory 대신 useNavigate 사용

function Booking() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate(); // useNavigate 훅 사용

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/recruits');
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="page-container">
            <Navbar />
            <div className="main-content" style={{ display: 'flex' }}>
                <Sidebar />
                <div className="right-content">
                    <div className="post-form-header">
                        <h1>Choose the right post for you!</h1>
                        <div className="post-buttons">
                            <button className="passenger-post-btn">Passenger's post</button>
                            <button className="driver-post-btn">Driver's post</button>
                        </div>
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
                    <div className="posts-container">
                        {posts.map((post, index) => (
                            <div key={index} className="post">
                                <h2>{post.title}</h2>
                                <p>{post.contents}</p>
                                {/* 기타 필요한 정보들 표시 */}
                            </div>
                        ))}
                    </div>
                    <Passenger1 navigate={navigate} /> {/* navigate 프롭스 전달 */}
                </div>
            </div>
        </div>
    );
}

export default Booking;
