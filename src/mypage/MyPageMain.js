import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../component/Navbar';
import EllipseSVG from '../icons/ellipse.svg';

const StyledLinkWrapper = styled.div`
  margin-top: 180px;
`;

const StyledLink = styled(Link)`
  margin-left: 90px;
  color: #b9cdff;
  font-family: 'Sansation', sans-serif;
  font-weight: bold;
  font-size: 55px;
  display: inline-block;
  margin-bottom: 30px;
  background: -webkit-linear-gradient(45deg, #b9cdff, #123456);
  background: linear-gradient(45deg, #b9cdff, #123456);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const EllipseIcon = styled.img`
  position: fixed;
  bottom: -120px;
  right: -70px;
`;

function MyPageMain() {
    return (
        <div className="my-page-container">
            <Navbar />
            <div className="my-page-content">
                <StyledLinkWrapper>
                    <StyledLink to="/mypage/signupInformation">Sign-up information</StyledLink><br />
                    <StyledLink to="/mypage/carpoolRecords">Recent carpooling records</StyledLink><br />
                    {/*<StyledLink to="/mypage/myPosts">My Post list</StyledLink><br />*/}
                    {/*<StyledLink to="/mypage/myComments">My Comment list</StyledLink><br />*/}
                    <StyledLink to="/chatPage">Chatting list</StyledLink>
                </StyledLinkWrapper>
            </div>
            <EllipseIcon src={EllipseSVG} alt="Ellipse Icon" />
        </div>
    );
}

export default MyPageMain;
