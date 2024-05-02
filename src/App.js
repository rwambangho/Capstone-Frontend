import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Header from './component/Header';
import AllPages from './page/AllPages';
import Login from './page/Login';
import SignUp from './page/SignUp';
import RegisterComForm from './community/RegisterComForm';
import Passenger1 from './recruitment/Passenger1';
import Booking from './booking/Booking';
import CommunityMain from './community/CommunityMain';
import MyPageMain from './mypage/MyPageMain';
import SignupInformation from './mypage/SignupInformation';
import MyComments from './mypage/MyComments';
import MyPosts from './mypage/MyPosts';
import CarpoolRecords from './mypage/CarpoolRecords';
import ChatList from './mypage/ChatList';
import PostDetail from './community/PostDetail';
import ChatRoom from './chat/chatRoom';
import ChatRoomList from './chat/chatRoomList';
import ChatBot from './chat/ChatBot';
import MainDetail from './main/mainDetail';
import MainDetail2 from './main/mainDetail2';
import Main from './main/main';
import '../src/css/main/transition.css';

function App() {
  return (
    <Router>
    
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/registercomform" element={<RegisterComForm />} />
          <Route path="/main" element={<AllPagesWithHeader />} />
          <Route path="/community" element={<CommunityMain />} />
          <Route path="/" element={<PageTransition><Main /></PageTransition>} />
          <Route path="/mainDetail" element={<PageTransition reverse><MainDetail /></PageTransition>} />
          <Route path="/mainDetail2" element={<PageTransition reverse><MainDetail2 /></PageTransition>} />
          <Route path="/carpool-recruitment" element={<Passenger1 />} />
          <Route path="/carpool-booking" element={<PageTransition slideRight><Booking /></PageTransition>} />
          <Route path="/mypage" element={<MyPageMain />} />
          <Route path="/mypage/signupInformation" element={<SignupInformation />} />
          <Route path="/mypage/myComments" element={<MyComments />} />
          <Route path="/mypage/myPosts" element={<MyPosts />} />
          <Route path="/mypage/carpoolRecords" element={<CarpoolRecords />} />
          <Route path="/mypage/chatList" element={<ChatList />} />
          <Route path="/post/:id" element={<PostDetail />}  />
          <Route path="/chat" element={<ChatRoom/>}/>
          <Route path="/chatRoomList" element={<ChatRoomList/>}/>
          <Route path="/chatBot" element={<ChatBot/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

function AllPagesWithHeader() {
  return (
    <>
      <Header />
      <AllPages />
    </>
  );
}

function PageTransition({ children, reverse, slideRight }) {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        classNames={reverse ? "page" : slideRight ? "page-slide-right" : "page-reverse"}
        timeout={1000}
      >
        <div className="page-transition-container">
          {children}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}
