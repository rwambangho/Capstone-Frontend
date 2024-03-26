import React from 'react';

const Post = ({ post }) => {
  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      {post.image && <img src={post.image} alt="post" />}
      <p>작성자: {post.nickName}</p>
      
    </div>
  );
};

<<<<<<< HEAD
export default Post;
=======
export default Post;

>>>>>>> 20acf9f1c403b026e548efb4477eabacabf45fb2
