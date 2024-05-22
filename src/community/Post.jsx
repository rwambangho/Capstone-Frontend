import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';


const PostContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    border: none;
    padding: 20px;
    background-color: #ffffff;
`;

const PostContent = styled.div`
    flex: 1;
    margin-right: 50px;
`;

const PostDateTime = styled.p`
    color: #1c5cff;
    font-size: 14px;
`;

const PostTitle = styled.h2`
    cursor: pointer;
    color: black;
    font-weight: bold;
    font-size: 24px;
`;

const PostText = styled.p`
    color: #7d7d7d;
    font-size: 16px;
    margin-bottom: 30px;
`;

const PostMeta = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
`;

const MetaItem = styled.div`
    color: ${({ color }) => color};
    font-weight: ${({ fontWeight }) => fontWeight};
`;

const Post = ({ post }) => {
    const navigate = useNavigate();

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

        return `${year}. ${month}. ${day}. ${ampm} ${formattedHour}: ${minute}: ${second}`;
    }

    function getCookieValue(cookieName) {
        const cookies = document.cookie.split('; ');
        for (let cookie of cookies) {
            const [key, value] = cookie.split('=');
            if (key === cookieName) {
                return value;
            }
        }
        return null;
    }

   

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

    return (
        <PostContainer>
            <PostContent>
                <PostDateTime>{formatDateTime(post.time)}</PostDateTime>
                <PostTitle onClick={navigateToPostDetail}>{post.title}</PostTitle>
                <PostText>{post.content}</PostText>
               
                <PostMeta>
                    <MetaItem color="#1c5cff" fontWeight="600">
                        <span style={{ marginRight: '10px' }}>hits {post.clickCount}</span>
                        <span style={{ marginRight: '10px' }}>likes {post.likeCount}</span>
                        <span>comments {post.commentSum}</span>
                    </MetaItem>
                    <MetaItem color="#797979" style={{ fontWeight: 'normal' }}>By {post.nickName}</MetaItem>
                </PostMeta>
            </PostContent>
            <div style={{ width: '30%', display: 'flex', alignItems: 'center' }}>
                {post.image && <img src={post.image.replace('/home/ubuntu/images', '/images')} alt="Post" style={{ width: '100%', height: 'auto', borderRadius: '5px' }} />}
            </div>
        </PostContainer>
    );
};

export default Post;
