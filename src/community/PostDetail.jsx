import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../component/Navbar';
import CommunitySidebar from '../component/CommunitySidebar';
import styled from 'styled-components';
import ChatBot from '../chat/ChatBot';
import { useNavigate } from 'react-router-dom';
import EditIcon from "../icons/edit.svg";
import blueIcon from '../icons/blueicon.svg';
import commentIcon from '../icons/comment.svg';
import blueHeartIcon from '../icons/blueheart.svg';
import heartIcon from '../icons/heart.svg';

// Styled components 정의
const DeleteButton = styled.button`
  height: 36px;
  padding: 8px 20px;
  background-color: #dc3545; /* 삭제 버튼 배경색 */
  color: white;
  border: 1px solid #dc3545; /* 삭제 버튼 테두리 색상 */
  margin-left: 400px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s; /* transition 추가 */
  &:hover {
    background-color: #c82333; /* 마우스를 올렸을 때 배경색 변경 */
    border-color: #c82333; /* 마우스를 올렸을 때 테두리 색상 변경 */
  }
  &:active {
    transform: translateY(1px); /* 클릭할 때 약간 아래로 이동 */
  }
`;

const PageContainer = styled.div`
  border-top: 1px solid #ccc !important; // CSS 우선순위 강제 적용
  display: block; // 요소가 확실히 블록 레벨로 렌더링되도록 함
  min-height: 1px;
  .post-detail {
    margin-bottom: 20px;
  }

  .post-detail-header {
    margin-bottom: 20px;
  }

  .post-detail-header p {
    margin-bottom: -15px;
    font-size: 0.9rem;
    color: #1c5cff;
  }

  .post-detail-header h2 {
    font-size: 1.6rem;
    margin-bottom: 30px;
  }

  .post-detail-header .info-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .stats span {
    margin-right: 20px;
    font-weight: bold;
  }
  
  .info-container .stats {
    font-size: 0.9rem;
    color: #1c5cff;
    margin-right: 15px;
  }

  .post-detail-header .author-info {
    margin-bottom: 40px;
    font-size: 0.9rem;
    color: #333;
  }

  .author-info {
    font-weight: 500;
  }

  .post-content {
    font-size: 1rem;
    line-height: 1.6;
    color: #333;
    margin-bottom: 20px;
  }

  .button-container {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }

  .button-container button {
    margin-top: 20px;
    padding: 8px 20px;
    font-size: 0.9rem;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    color: white;
  }

  .like-button {
    background-color: #007bff;
    
  }

  .comment-button {
    background-color: #28a745;
  }

  .comment-section {
    border-top: 1px solid #ccc;
    padding-top: 10px;
    margin-bottom: 60px;
  }

  .comment-container {
    margin-bottom: 20px;
    margin-top: 15px;
  }

  .comment {
    background-color: #e9ecef;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
  }

  .comment p {
    margin-left: 10px;
    font-weight: 600; /* 모두 굵게 */
    color: #000000; /* 댓글 작성자의 이름과 댓글 내용의 색상 */
    font-size: 0.9rem; /* 기본 폰트 크기 */
  }

  .comment p:nth-child(3) {
    color: #797979; /* 작성날짜의 색상 */
  }

  .comment-form {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .comment-form input[type='text'] {
    padding: 10px;
    font-size: 0.9rem;
    border: 2px solid #ccc;
    border-radius: 5px;
    height: auto;
    flex-grow: 1;
  }

  .comment-form button[type='submit'] {
    padding: 10px 20px;
    font-size: 0.9rem;
    border: 1px solid #1C5CFF;
    border-radius: 5px;
    height: auto;
    background-color: #1C5CFF;
    cursor: pointer;
    width: auto;
  }

  .sidebar-container {
    flex: 0 0 17%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-start;
    padding: 20px;
  }
  
  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .page-number {
    cursor: pointer;
    margin: 0 8px;
    color: ${props => props.active ? '#1c5cff' : '#000'};
    text-decoration: ${props => props.active ? 'underline' : 'none'};
  }
`;

const SidebarContainer = styled.div`
  flex: 0 0 17%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 20px;

  /* 버튼과 ChatBot 사이의 간격을 조절하는 스타일 */
  & > *:not(:last-child) {
    margin-bottom: 10px;
  }
`;

// 버튼 스타일드 컴포넌트 정의
const WritePostButton = styled.button`
    display: flex;        // Use flexbox to align children
    align-items: center;  // Align children vertically in the center
    justify-content: center;  // Align children horizontally in the center
    padding: 8px 20px;
    background-color: #1C5CFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: auto;
`;

const PageNumber = styled.span`
  cursor: pointer;
  margin: 0 8px;
  color: ${props => props.active ? '#1c5cff' : '#000'};
  text-decoration: ${props => props.active ? 'underline' : 'none'};
`;
const Icon = styled.img`
    width: 20px; /* 아이콘 크기 조정 */
    height: 20px; /* 아이콘 크기 조정 */
    margin-right: 10px; /* 아이콘과 텍스트 사이의 간격 조정 */
`;
const CommentButton = styled.button`
    display: flex;        // Use flexbox to align children
    align-items: center;  // Align children vertically in the center
    justify-content: center;  // Align children horizontally in the center
    padding: 8px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: auto;
`;

const NicknameWrapper = styled.div`
  border-radius: 20px; /* 타원 모양의 테두리 반경 설정 */
  border: 1px solid #969696; /* 테두리 색상 및 두께 설정 */
  padding: 5px 20px; /* 내부 패딩 설정 */
  display: inline-block; /* 요소를 인라인 블록으로 표시하여 너비와 높이를 컨텐츠 크기에 맞게 조절 */
`;

const LikeButton = styled.button`
  background-color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  color: white;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  img {
    width: 24px; /* 아이콘 크기를 키움 */
    height: 24px; /* 아이콘 크기를 키움 */
    margin-right: 5px;
  }
`;

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const [commentInput, setCommentInput] = useState('');
  const [liked, setLiked] = useState('');
  const usernickname = getCookieValue('nickname');
  const userId = getCookieValue('id');
  const currentTime = new Date();
  const [showComments, setShowComments] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(5);
  const [showPagination, setShowPagination] = useState(false); // 페이지네이션 표시 여부 상태 추가
  const navigate = useNavigate(); // useNavigate 추가

  useEffect(() => {
    axios.get(`/api/community/posts/read/${id}`)
        .then(response => {
          console.log(response.data.likesDto);
          const likedByUser = response.data.likesDto.find(like => like.userId === userId);
          console.log(likedByUser);
          console.log(userId);
          setLiked(likedByUser ? likedByUser.liked : false);
          setPost(response.data);
        })
        .catch(error => {
          console.error('Error fetching post:', error);
        });
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = post.commentsDto.slice(indexOfFirstComment, indexOfLastComment);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleInputChange = (e) => {
    setCommentInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/comments/save`, {
        communityId: post.id,
        comment: commentInput,
        time: currentTime.toISOString()
      });
      const updatedPostResponse = await axios.get(`/api/community/posts/read/${id}`);
      setPost(updatedPostResponse.data);
      setCommentInput('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const toggleLike = async () => {
    try {
      if (liked) {
        await axios.put(`/api/community/subLike/${id}`);
        setPost(prevPost => ({
          ...prevPost,
          likeCount: prevPost.likeCount - 1
        }));
      } else {
        await axios.put(`/api/community/addLike/${id}`);
        setPost(prevPost => ({
          ...prevPost,
          likeCount: prevPost.likeCount + 1
        }));
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const deletePost = async () => {
    try {
      await axios.delete(`/api/community/${post.id}`);
      navigate("/community");
    } catch (error) {
      console.error("삭제 실패");
    }
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

  function formatDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const formattedDateTime = `${year}. ${month}. ${day}. ${ampm} ${formattedHour}: ${minute}: ${second}`;
    return formattedDateTime;
  }

  return (
      <PageContainer>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
          <CommunitySidebar />
          <div style={{ flex: '1', backgroundColor: '#ffffff', padding: '60px', marginLeft: '30px', borderRadius: '10px' }}>
            <div className="post-detail">
              <div className="post-detail-header">
                <p>{formatDateTime(post.time)}</p>
                <h2>{post.title}</h2>
                <div className="info-container">
                  <div className="stats">
                    <span>hits {post.clickCount}</span>
                    <span>likes {post.likeCount}</span>
                    <span>comments {post.commentsDto.length}</span>
                  </div>
                  <NicknameWrapper className="NicknameWrapper">
                    <p style={{ margin: '0', color: "grey", fontSize: "12px" }}> By {post.nickName}</p>
                  </NicknameWrapper>
                </div>
              </div>
              {post.image && <img src={post.image.replace('/home/ubuntu/images', '/images')} alt="post" style={{ maxWidth: '100%', height: 'auto', borderRadius: '5px', marginBottom: '20px', marginTop: '30px' }} />}
              <p className="post-content">{post.content}</p>
              <div className="button-container">
                <LikeButton onClick={toggleLike}>
                  {liked ? (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={blueHeartIcon} alt="Blue Heart Icon" />
                        <span style={{ marginLeft: '5px' }}>Like</span>
                      </div>
                  ) : (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={heartIcon} alt="Heart Icon" />
                        <span style={{ marginLeft: '5px' }}>Like</span>
                      </div>
                  )}
                </LikeButton>
                <CommentButton className='comment-button' onClick={() => {
                  setShowComments(!showComments);
                  setShowPagination(!showComments); // 댓글 보기 버튼을 누를 때 페이지네이션 상태를 댓글 보기 상태의 반대로 설정
                }}>
                  <Icon src={commentIcon} alt="Comment Icon" />
                  <span>{showComments ? 'Comments ▲' : 'Comments ▼'}</span>
                </CommentButton>
                {post.nickName === usernickname && <DeleteButton onClick={deletePost}>Delete</DeleteButton>}
              </div>
              {showComments && (
                  <div className='comment-section'>
                    <div className='comment-container'>
                      {currentComments.length > 0 ? (
                          currentComments.map((comment, index) => (
                              <div className='comment' key={index}>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  marginLeft: '10px',
                                  marginTop: '10px'
                                }}>
                                  <Icon src={blueIcon} alt="Blue Icon" /> {/* 파란색 아이콘 추가 */}
                                  <p style={{ margin: '0' }}>{comment.nickName}</p> {/* 닉네임 */}
                                </div>
                                <p>{comment.comment}</p>
                                <p>{formatDateTime(comment.time)}</p>
                              </div>
                          ))
                      ) : (
                          <p>댓글이 없습니다.</p>
                      )}
                    </div>
                    <form onSubmit={handleSubmit} className='comment-form'>
                      <input
                          type="text"
                          placeholder="Enter your comment"
                          value={commentInput}
                          onChange={handleInputChange}
                      />
                      <button type="submit" style={{ color: '#ffffff' }}>Register</button>
                    </form>
                  </div>
              )}
              {showPagination && (
                  <div className='pagination-container'>
                    {[...Array(Math.ceil(post.commentsDto.length / commentsPerPage)).keys()].map(number => (
                        <PageNumber
                            key={number}
                            active={currentPage === number + 1}
                            onClick={() => paginate(number + 1)}
                        >
                          {number + 1}
                        </PageNumber>
                    ))}
                  </div>
              )}
            </div>
          </div>
          <SidebarContainer>
            <WritePostButton onClick={() => navigate('/registercomform')}>
              <Icon src={EditIcon} alt="Edit Icon" /> Write a Post
            </WritePostButton>
            <ChatBot />
          </SidebarContainer>
        </div>
      </PageContainer>
  );
};

export default PostDetail;
