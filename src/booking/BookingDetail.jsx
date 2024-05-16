//BookingDetail
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../component/Navbar';
import Sidebar from '../component/Sidebar';
import { useParams } from 'react-router-dom';
import BlueDriverIcon from '../icons/bluedriver.svg';

function BookingDetail() {
    const [post, setPost] = useState(null);
    const { postId } = useParams();
    const [nickname] = useState(getCookieValue('nickname'));
    const navigate = useNavigate();

    const sendNicknameToServer = () => {
        axios.post('/Chat', {
            userId1: nickname,
            userId2: post.nickname
        })
            .then(response => {
                navigate(`/chat?userId1=${nickname}&userId2=${post.nickname}`);
                console.log('Nickname sent to server:', response.data);
            })
            .catch(error => {
                console.error('Error sending nickname to server:', error);
            });
    };

    function getCookieValue(cookieName) {
        const cookies = document.cookie.split('; ');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split('=');
            if (cookie[0] === cookieName) {
                return cookie[1];
            }
        }
        return null;
    }

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


    const handleBooking = async () => {
        try {

            const response = await axios.post('/recruits/booking', null, {
                params: {
                    idxNum: postId,
                    nickname: nickname
                }
            });
            if (response.data) {
                alert("success booking");
                window.location.reload();
            }
            else {
                alert("이미 예약했습니다");
            }
        } catch (error) {
            console.log(nickname);
            console.error('Error booking:', error);
        }
    };
    const handleAddBooking = async (user) => {
        const confirmBooking = window.confirm("정말 예약을 완료하시겠습니까?");
        if (confirmBooking) {
            try {
                const response = await axios.post('/recruits/addBooking', null, {
                    params: {
                        idxNum: postId,
                        nickname: user
                    }
                });
                if (response.data) {
                    alert("예약이 확정되었습니다.");
                }
                else {
                    alert("이미 예약이 가득찼습니다,");
                }
                console.log(response.data);
                window.location.reload()
            } catch (error) {
                console.error('Error booking:', error);
            }
        }
    };

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

    // driver's post 여부를 확인하여 상태를 설정합니다.
    const isDriverPost = post.driverPost;

    return (
        <div className="page-container">
            <Navbar />
            <div className="main-content">
                <div className="right-content">

                    <div className="outer-post-card">
                        <div className="post-header">
                            <div className="post-user-info">
                                <span className="user-name">{post.nickname}</span>
                                <span className="post-role">{isDriverPost ? "Driver" : "Passenger"}</span>
                            </div>
                            <div className="waiting-for-text">
                                {isDriverPost ? (
                                    <>Waiting <br/> for Passenger</>
                                ) : (
                                    <>Waiting <br/> for Driver</>
                                )}
                            </div>
                        </div>
                        <div className="inner-post-card">
                            <span className="post-date">{displayDate}</span>
                            <div className="location-container">
                                <div className="location-marker departure-marker">
                                <div className="location-dot-white"></div>
                                    <div className="location-line"></div>
                                </div>
                                <div className="location-details">
                                    <div className="location-point departure">
                                        <span className="location-title1">{post.departure}</span>
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
                                        <span className="location-title2">{post.destination}</span>
                                        <span className="location-detail">{post.destinationDetail}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="post-distance">{post.distance}km</div>
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
                                <div className="comment-header">
                                    <img src={BlueDriverIcon} alt="Blue Driver Icon" className="comment-icon"/>
                                    {post.nickname}'s Comment
                                </div>
                                <div className="comment-body">{post.message}</div>
                            </div>
                            {post.driverPost && (
                                <div>
                                    현재 인원:{post.participant}/{post.maxParticipant}
                                </div>
                            )}
                            <div className="user-list">
                                현재 예약 인원:
                                {post.nickname === nickname && post.users && post.users.map((user, index) => (
                                    <button key={index} className="user-button" type="button"
                                            onClick={() => handleAddBooking(user)}>{user}</button>
                                ))}
                            </div>
                            <div>
                                {post.nickname === nickname && post.users && post.bookingUsers.map((user, index) => (
                                    <span key={index} className="user-text">{user}, </span>
                                ))}
                            </div>
                            <div className="comment-actions">
                                {post.driverPost && (
                                    <button className="btn-comment-cancel" type="button"
                                            onClick={handleBooking}>Booking</button>
                                )}
                                {post.nickname !== nickname && (
                                    <button className="btn-comment-confirm"
                                            onClick={sendNicknameToServer}>Chatting</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                {`                  
           
             .outer-post-card {
                 background-color: #fff;
                 border-radius: 8px;
                 width: 100%;
                 max-width: 800px;
                 margin-top: 50px;
                 margin-bottom: 20px;
                 padding: 20px;
                 margin-left: auto; /* Center the card horizontally */
                 margin-right: auto; /* Center the card horizontally */
             }
             
             
             .main-content {
                flex-grow: 1;
                display: flex;
                padding: 20px;
                margin-right: 300px;
             }

            .right-content {
                flex-grow: 1;
                padding: 20px;
                margin-left: 300px;
            }
             

            .post-header {
             display: flex;
             justify-content: space-between;
             align-items: center;
             align-bottom: 20px;
             flex-wrap: wrap;
             }
        
             .post-user-info {
                margin-top: 30px;
                margin-left: 10px;
                display: flex;
                align-items: center;
       
             }

             .waiting-for-text {
               font-weight: bold;
               color: blue;
               margin-right: 10px;
               margin-top: 15px;
               text-align: right;
               white-space: pre-line; /* 줄 바꿈을 적용하여 텍스트가 제대로 표시되도록 함 */
             }
        
                  .user-details {
                    margin-left: 10px;
                  }
        
                  .user-name{
                   font-weight: bold;
                  }
                  
                  .post-role {
                    display: inline-block;
                    background-color: rgba(28, 92, 255, 0.6); /* 배경색 */
                    color: white; /* 텍스트 색상 */
                    font-size: 0.8em; /* 글꼴 크기 */
                    font-weight: normal; /* 일반체로 설정 */
                    border-radius: 20px; /* 원형 모양 */
                    padding: 3px 8px; /* 내부 여백 */
                    margin-left: 15px; /* 사용자 이름과의 간격 */
                  }
        
                  .post-date {
                    margin-left: 30px;
                    font-weight: 700;
                    color: #black;
                    margin-bottom: 20px;
                   
                    
                  }
        
                  .post-distance {
                    margin-left: 30px;
                    margin-top: 10px;
                    margin-bottom: 10px;
                    font-weight: 600;
                    color: #888888;
                  }
        
                  .inner-post-card {
                    background-color: #f5f5f5;
                    padding: 30px 10px;
                    border-radius: 8px;
                    margin-top: 40px;
                    padding-bottom: 20px;
                    position: relative;
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
                    margin-top:10px;
                  }
        
                  .post-keywords {
                    display: flex;
                    flex-wrap: wrap; /* 키워드가 많을 경우 다음 줄로 넘어가게 설정 */
                    gap: 10px; /* 키워드 사이의 간격 */
                    margin-top: 30px; /* 키워드와 다른 컨텐츠 사이의 간격 */
                  }
        
                  .post-keyword {
                    background-color: #50c878; /* 밝은 녹색 배경 */
                    color: white; /* 흰색 텍스트 */
                    padding: 8px 16px; /* 상하 8px, 좌우 16px의 패딩 */
                    border-radius: 20px; /* 둥근 모서리 */
                    font-size: 0.9em; /* 적절한 텍스트 크기 */
                    white-space: nowrap; /* 키워드를 한 줄로 표시 */
                  }
                  
                    
                  .post-created-at {
                    font-size: 1rem;
                    color: #666;
                    margin-top: 30px;
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
                    margin-left: 28px;
                  }
        
                  .location-dot-blue {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background-color: blue;
                    border: 2px solid blue;
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
        
                  .location-title1 {
                    font-weight: bold;
                    display: block; /* 타이틀을 블록 요소로 만들어 줄 바꿈 */
                    margin-top: 8px;
                    margin-left: -45px;
                  }
        
                  .location-title2 {
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
                  .comment-header {
                    display: flex;
                    align-items: center; 
                    font-size: 1.1em; 
                    font-weight: bolder;
                    padding: 10px 10px;
                  }

                .comment-icon {
                    width: 24px; /* 아이콘 너비 조정 */
                    height: 24px; /* 아이콘 높이 조정 */
                    margin-right: 10px; /* 아이콘과 텍스트 사이의 간격 */
                 }
                 .comment-body {
                    font-size: 1.1em;
                    padding: 6px 12px;
                    font-weight: 600;
                  }
                  
                  .comment-actions {
                      display: flex;
                      justify-content: space-between; /* 버튼을 양쪽으로 정렬 */
                      padding: 10px 0; /* 상하 패딩 추가 */
                    }
                    
                    
                    .user-list {
                        margin-top: 25px;
                    }
                    
                    
                    .btn-comment-cancel, .btn-comment-confirm {
                      flex-grow: 1; /* 버튼들이 동일한 크기를 가지도록 함 */
                      margin: 0 10px; /* 좌우 마진을 추가하여 버튼 사이 간격 조정 */
                      padding: 12px 5px; /* 패딩을 조정하여 버튼 크기 감소 */
                      font-size: 1em; /* 폰트 크기를 줄임 */
                      font-weight: 700;
                      border-radius: 20px;
                      margin-top : 30px;
                      border: 1px solid #1c5cff;
                      margin-bottom: 20px;
                    }
                    
                    .btn-comment-cancel {
                      background-color: blue; /* 취소 버튼 색상 */
                      color: white;
                    }
                    
                    .btn-comment-confirm {
                      background-color: blue; /* 확인 버튼 색상 */
                      color: white;
                    }
                    
                  
                `}
            </style>
        </div>
    );
}

export default BookingDetail;