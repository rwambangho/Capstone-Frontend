import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // useParams import 추가
import Navbar from '../component/Navbar';
import CommunitySidebar from '../component/CommunitySidebar';
import '../css/community/Community.css';

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const { id } = useParams(); // useParams 훅 사용하여 포스트 ID 가져오기
  const [commentInput, setCommentInput] = useState('');
  const [liked, setLiked] = useState('false'); 
  const userId = getCookieValue('id');
  const currentTime = new Date();

  useEffect(() => {
    // useParams로 가져온 포스트의 ID를 사용하여 서버에서 해당 포스트를 가져옵니다.
   
    axios.get(`/community/posts/read/${id}`)
      .then(response => {
        
        console.log(response.data.likesDto);
        const likedByUser = response.data.likesDto.find(like => like.userId === userId);
        setLiked(likedByUser ? likedByUser.liked : false);

        
        setPost(response.data);
        
      })
      .catch(error => {
        console.error('Error fetching post:', error);
      });
  }, [id]); // id가 변경될 때마다 useEffect가 실행되도록 설정

  if (!post) {
    return <div>Loading...</div>;
  }

  const handleInputChange = (e) => {
    setCommentInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/comments/save`, {
        communityId: post.id,
        comment: commentInput,
        time: currentTime.toISOString()
      });
      const updatedPostResponse = await axios.get(`/community/posts/read/${id}`);
      setPost(updatedPostResponse.data);
      setCommentInput(''); // 댓글 입력창 비우
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };


  const toggleLike = async () => {
    try {
      if (liked) {
        // 좋아요 취소 로직
        await axios.put(`/community/subLike/${id}`);
      } else {
        // 좋아요 로직
        await axios.put(`/community/addLike/${id}`);
      }
      setLiked(!liked); // 좋아요 상태 토글
    } catch (error) {
      console.error('Error toggling like:', error);
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

    const ampm = hour >= 12 ? '오후' : '오전';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;

    const formattedDateTime = `${year}년 ${month}월 ${day}일 ${ampm} ${formattedHour}시 ${minute}분 ${second}초`;
    return formattedDateTime;
}

  return (
    <div className="page-container">
      <Navbar />
      <div className="main-content">
      <CommunitySidebar />
    <div className="content-form-container">
    <div className="post-detail">
      <h2>{post.title}</h2>
      <div className='postDetail-info'>
      <p className='author-info'> By {post.nickName}</p>
      <p className='clickCount'> 조회 수:{post.clickCount}</p>
      <p className='likeCount'>좋아요 수:{post.likeCount}</p>
      <p className='writeTime'>작성시간:{formatDateTime(post.time)}</p>
      </div>
     
      {post.image && <img src={post.image.replace('/Users/kimseungzzang/ideaProjects/capstone-frontend/public/images', '/images')} alt="post" />}

      <p>{post.content}</p>
      <div className='comment-container'>
      {post.commentsDto && post.commentsDto.map(comment => (
    <div className='comment' key={comment.id}>
      <p>{comment.nickName}</p>
      <p>{comment.comment}</p>
      <p>{formatDateTime(comment.time)}</p>
      </div>
    ))}
    </div>

       <button className='LikeButton' onClick={toggleLike}>
                {liked ? '좋아요 취소' : '좋아요'}
              </button>

    <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="댓글을 입력하세요"
          value={commentInput}
          onChange={handleInputChange}
        />
        <button type="submit">댓글 작성</button>
      </form>
    </div>
    </div>
    </div>
    </div>
  );
};

export default PostDetail;
