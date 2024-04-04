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
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      {post.image && <img src={post.image} alt="post" />}
      <p>작성자: {post.nickName}</p>
      <button onClick={sendNicknameToServer}>Send Nickname</button>
    </div>
  );
};

export default Post;
