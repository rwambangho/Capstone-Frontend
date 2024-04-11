// Post.js
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate를 import 합니다.



const Post = ({ post }) => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 가져옵니다.
  
  const sendNicknameToServer = () => {
    const userId = getCookieValue('id');
    

    axios.post('/Chat', {
      userId1: userId,
      userId2: post.nickName
    })
    .then(response => {
      navigate(`/chat?userId1=${userId}&userId2=${post.nickName}`); // navigate 함수를 사용하여 페이지를 이동합니다.
      console.log('Nickname sent to server:', response.data);
    })
    .catch(error => {
      console.error('Error sending nickname to server:', error);
    });
  };

  const navigateToPostDetail = () => {
    
    
    axios.put('/community/addClickCount', {
      id: post.id
    })
    .then(response => {
      console.log('PUT request successful:', response.data);
      navigate(`/post/${post.id}`);
    })
    .catch(error => {
      console.error('Error sending PUT request:', error);
    });

   


  };

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

  return (
    <div className="post-detail">
      <h2 onClick={navigateToPostDetail}>{post.title}</h2>
      <p>{post.content}</p>
      {post.image && <img src={post.image.replace('/Users/kimseungzzang/ideaProjects/capstone-frontend/public/images', '/images')} alt="post" />}
      <div className='post-info'>
      <p className='author-info'> By {post.nickName}</p>
      <p className='clickCount'>조회 수:{post.clickCount}</p>
      <p className='likeCount'>좋아요 수:{post.likeCount}</p>
      <p className='commentCont'>댓글 수:{post.commentSum}</p>
      <p className='writeTime'> 작성 시간:{formatDateTime(post.time)}</p>
      
      </div>
      <button onClick={sendNicknameToServer}>채팅하기</button>
     
    </div>
  );
};

export default Post;
