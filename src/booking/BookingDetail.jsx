import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../component/Navbar';
import Sidebar from '../component/Sidebar';
import { useParams } from 'react-router-dom';

function BookingDetail() {
    const [post, setPost] = useState(null);
    const { postId } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/recruits/${postId}`);
                setPost(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        fetchPost();
    }, [postId]);

    if (!post) {
        return <div>Loading...</div>;
    }

    const departureDate = new Date(post.departureDate);
    const formattedDate = departureDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    const dayOfWeek = departureDate.toLocaleDateString('en-US', { weekday: 'short' });
    const displayDate = `${formattedDate}(${dayOfWeek}) ${post.departureTime}`;

    return (
        <div className="page-container">
            <Navbar />
            <div className="main-content">
                <Sidebar />
                <div className="right-content">
                    <div className="outer-post-card">
                        <div className="post-header">
                            <div className="post-user-info">
                                <span className="user-name">{post.username}</span>
                                <span className="post-date">{displayDate}</span>
                            </div>
                            <div className="post-distance">{post.distance}</div>
                        </div>
                        <div className="inner-post-card">
                            <div className="location-container">
                                <div className="location-marker departure-marker">
                                    <div className="location-dot-white"></div>
                                    <div className="location-line"></div>
                                </div>
                                <div className="location-details">
                                    <div className="location-point departure">
                                        <span className="location-title">{post.departure}</span>
                                        <span className="location-detail">{post.departureDetail}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="location-container">
                                <div className="location-marker destination-marker">
                                    <div className="location-dot-blue"></div>
                                </div>
                                <div className="location-details">
                                    <div className="location-point destination">
                                        <span className="location-title">{post.destination}</span>
                                        <span className="location-detail">{post.destinationDetail}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='post-form-bottom'>
                            <div className="post-keywords">
                                {post.keywords && post.keywords.map((keyword, kIndex) => (
                                    <span key={kIndex} className="post-keyword">{keyword}</span>
                                ))}
                            </div>
                            <div className="post-created-at">
                                {new Date(post.createdAt).toLocaleString()}
                            </div>
                            <div className="comment-section">
                                <div className="comment-header">{post.username}'s Comment</div>
                                <div className="comment-body">{post.message}</div>
                            </div>
                                <div className="comment-actions">
                                    <button className="btn-comment-cancel">Booking</button>
                                    <button className="btn-comment-confirm">Chatting</button>
                                </div>



                    </div>
                </div>
            </div>
        </div>

    <style>
        {`                  
                  .main-content {
                  flex-grow: 1;
                  display: flex;
                  padding: 20px;
                  }

                  .right-content {
                    flex-grow: 1;
                    padding: 20px;
                    background-color: #f5f5f5;
                  }
                  
                  .outer-post-card {
                    background-color: #fff;
                    border-radius: 8px;
                    width: 100%;
                    height: 700px;
                    max-width: 800px; /* 적절한 최대 너비 설정 */
                    margin-top:50px;
                    margin-bottom: 20px;
                    margin-left: 300px;
                    padding: 20px;
                  }

                  .post-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                  }
        
                  .post-user-info {
                    display: flex;
                    align-items: center;
                    flex-direction: column; /*수직으로 배치*/
                  }
        
                  .user-avatar {
                    /* 아바타 스타일 */
                  }
        
                  .user-details {
                    margin-left: 10px;
                  }
        
                  .user-name {
                    font-weight: bold;
                  }
        
                  .post-date {
                    margin-top: 30px;
                   
                    
                  }
        
                  .post-distance {
                    /* 거리 스타일 */
                  }
        
                  .inner-post-card {
                    background-color: #f5f5f5;
                    padding: 10px;
                    border-radius: 8px;
                    margin-top: 50px;
                  }
        
                  .posts-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                  }
        
                  .post-card {
                    background-color: white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    border-radius: 8px;
                    width: 100%;
                    max-width: 600px; /* Adjust based on your layout */
                    margin-bottom: 20px;
                    padding: 20px;
                  }
        
                  .post-title {
                    font-size: 1.2em;
                    margin-bottom: 15px;
                  }
        
                  .post-info {
                    margin-bottom: 15px;
                  }
        
                  .post-departure,
                  .post-destination,
                  .post-date-time {
                    margin-bottom: 10px;
                    
                  }
        
                  .post-actions {
                    text-align: right;
                  }
        
                  .post-location {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 20px;
                  }
        
                  .location-container {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 20px;
                    position: relative;
                  }
        
                  .post-keyword {
                    background-color: green;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 15px;
                    margin-right: 20px;
                    
                    
                  }
        
                  .post-created-at {
                    font-size: 1rem;
                    color: #666;
                    margin-top: 55px;
                    margin-bottom: 10px;
                  }
        
                  .location-marker {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-right: 10px;
                    
                  }
        
                  .location-dot-white {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background-color: #fff;
                    border: 2px solid blue; /* 흰색 동그라미에 파란색 테두리 */
                    z-index: 2;
                    position: relative; /* 위치를 조정하기 위해 relative로 설정 */
                    margin-top: 20px;
                    margin-bottom: 10px; /* 선과의 간격 */
                    margin-left: 30px;
                  }
        
                  .location-dot-blue {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background-color: blue;
                    border: 2px solid white; /* 흰색 테두리 추가 */
                    position: absolute; /* 절대 위치 지정 */
                    top: 50%; /* 부모 요소의 상단에서 50% 위치 */
                    left: 0; /* 부모 요소의 왼쪽에 배치 */
                    transform: translate(-50%, -50%); /* 부모 요소의 중앙으로 이동 */
                    z-index: 3; /* 흰색 동그라미 위에 배치 */
                    margin-left: 35px;
                    margin-top: 20px;
                  }
        
                  .location-point {
                    text-align: center;
                    
                  }
        
                  .location-title {
                    font-weight: bold;
                    display: block; /* 타이틀을 블록 요소로 만들어 줄 바꿈 */
                    margin-top: 35px;
                  }
        
                  .location-details {
                    margin-left: 50px; /* 선과의 간격을 만들기 위해 margin-left 적용 */
                    flex-grow: 1;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    min-height: 60px; /* 세부사항이 적을 때도 컨테이너가 줄어들지 않도록 최소 높이 설정 */
                    
                  }
        
                  .location-line {
                    width: 2px;
                    height: 150%; /* 선의 높이를 조정하여 전체 컨테이너를 커버하도록 함 */
                    background-color: blue;
                    position: absolute;
                    left: 5px; /* 선을 동그라미의 중앙에 위치시킴 */
                    top: 12px; /* 선의 시작 위치를 조정 */
                    margin-left: 30px;
                    margin-top: 20px;
                  }
        
                  .post-date-time {
                    text-align: center;
                    margin-top: 20px;
                  }
        
                  .location-point.departure,
                  .location-point.destination {
                    text-align: left;
                    flex-grow: 1;
                    
                  }
        
                  .location-title,
                  .location-detail {
                    color: #333; /* 텍스트 색깔 */
                    font-size: 0.9em; /* 텍스트 크기 */
                    
                  }
                  
                  .comment-section {
                    background-color: #f5f5f5;
                    padding: 10px;
                    border-radius: 8px;
                    margin-top: 50px;
                    height: 130px;
                  }
                  
                  .comment-actions {
                      display: flex;
                      justify-content: space-between; /* 버튼을 양쪽으로 정렬 */
                      padding: 10px 0; /* 상하 패딩 추가 */
                    }
                    
                    .comment-header {
                        font-size: 1em; /* 텍스트 크기 */
                        font-weight: bolder;
                    }
                    
                    .btn-comment-cancel, .btn-comment-confirm {
                      flex-grow: 1; /* 버튼들이 동일한 크기를 가지도록 함 */
                      margin: 0 50px; /* 좌우 마진을 추가하여 버튼 사이 간격 조정 */
                      padding: 15px 5px; /* 패딩을 조정하여 버튼 크기 감소 */
                      font-size: 0.8em; /* 폰트 크기를 줄임 */
                      border-radius: 20px;
                      margin-top : 30px;
                    }
                    
                    .btn-comment-cancel {
                      background-color: blue; /* 취소 버튼 색상 */
                    }
                    
                    .btn-comment-confirm {
                      background-color: blue; /* 확인 버튼 색상 */
                    }
                  
                  
                `}
            </style>
        </div>
    );
}

export default BookingDetail;
