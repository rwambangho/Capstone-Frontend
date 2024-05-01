import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../component/Navbar';
import CommunitySidebar from '../component/CommunitySidebar';
import Post from './Post';
import ChatBot from '../chat/ChatBot';

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
    padding: 60px;
`;

const PaginationContainer = styled.nav`
    display: flex;
    justify-content: center;
    margin-top: 20px;
`;

const PageNumber = styled.span`
    cursor: pointer;
    margin: 0 8px;
    color: ${props => props.active ? '#1c5cff' : '#000'};
    text-decoration: ${props => props.active ? 'underline' : 'none'};
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
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: auto;
`;

function CommunityMain() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const navigate = useNavigate();

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
                    <PaginationContainer>
                        {[...Array(Math.ceil(posts.length / postsPerPage)).keys()].map(number => (
                            <PageNumber
                                key={number}
                                active={currentPage === number + 1}
                                onClick={() => paginate(number + 1)}
                            >
                                {number + 1}
                            </PageNumber>
                        ))}
                    </PaginationContainer>
                </ContentWrapper>
                <SideBarContainer>
                    <WritePostButton onClick={() => navigate('/registercomform')}>
                        Write a Post
                    </WritePostButton>
                    <ChatBot/>
                </SideBarContainer>
            </ContentContainer>
        </Container>
    );
}

export default CommunityMain;
