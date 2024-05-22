//CommunityMain.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../component/Navbar';
import CommunitySidebar from '../component/CommunitySidebar';
import Post from './Post';
import ChatBot from '../chat/ChatBot';
import EditIcon from '../icons/edit.svg';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
`;

const ContentContainer = styled.div`
    flex: 1;
    display: flex;
    justify-content: space-between;
    padding: 20px;
`;

const ContentWrapper = styled.div`
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    padding: 55px;
    margin-left: 30px;
    border-radius: 10px;
`;


const SideBarContainer = styled.div`
    flex: 0 0 17%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-start;
    padding: 20px;
`;

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
const Icon = styled.img`
    width: 20px; /* 아이콘 크기 조정 */
    height: 20px; /* 아이콘 크기 조정 */
    margin-right: 10px; /* 아이콘과 텍스트 사이의 간격 조정 */
`;
function CommunityMain() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);

    useEffect(() => {
        axios.get('/community/')
            .then(response => {
                setPosts(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = pageNumber => setCurrentPage(pageNumber);


    return (
        <Container>
            <Navbar/>
            <ContentContainer>
                <CommunitySidebar/>
                <ContentWrapper>
                    {currentPosts.map(post => (
                        <Post key={post.id} post={post}/>
                    ))}

                    <style>
                        {`
                        .pagination-container {
                        display: flex;
                        justify-content: center;
                        margin-bottom: 25px;
                    }

                        .page-number {
                        cursor: pointer;
                        margin: 0 8px;
                        color: #000; /* 기본 색상 */
                        text-decoration: none; /* 기본 텍스트 꾸미기 제거 */
                    }

                        .page-number.active {
                        color: #1c5cff; /* 활성 상태일 때의 색상 */
                        text-decoration: underline; /* 활성 상태일 때의 텍스트 꾸미기 */
                    }
                     `}
                    </style>
                </ContentWrapper>
                <SideBarContainer>
                    <WritePostButton onClick={() => navigate('/registercomform')}>
                        <Icon src={EditIcon} alt="Edit Icon"/> Write a Post
                    </WritePostButton>
                    <ChatBot/>
                </SideBarContainer>

            </ContentContainer>
            <div className="pagination-container">
                            <span className="page-number"
                                  onClick={() => paginate(currentPage - 1)}>&laquo; Previous</span>
                {[...Array(Math.ceil(posts.length / postsPerPage)).keys()].map(number => (
                    <span
                        key={number}
                        className={`page-number ${currentPage === number + 1 ? 'active' : ''}`}
                        onClick={() => paginate(number + 1)}
                    >
                                    {number + 1}
                                </span>
                ))}
                <span className="page-number" onClick={() => paginate(currentPage + 1)}>Next &raquo;</span>
            </div>
        </Container>
    );

}

export default CommunityMain;