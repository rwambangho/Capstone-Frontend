// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './component/Header';
import AllPages from './page/AllPages';
import Login from './page/Login';
import SignUp from './page/SignUp';
import RegisterComForm from './community/RegisterComForm';
import Jejudo1 from './main/Jejudo1';
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


function App() {
  return (
    <Router>

        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/registercomform" element={<RegisterComForm />} />
            <Route path="/" element={<AllPagesWithHeader />} />
            <Route path="/community" element={<CommunityMain />} />
            <Route path="/main" element={<Jejudo1 />} /> 
            <Route path="/carpool-recruitment" element={<Passenger1 />} />
            <Route path="/carpool-booking" element={<Booking />} />
            <Route path="/mypage" element={<MyPageMain />} />
            <Route path="/mypage/signupInformation" element={<SignupInformation />} />
            <Route path="/mypage/myComments" element={<MyComments />} />
            <Route path="/mypage/myPosts" element={<MyPosts />} />
            <Route path="/mypage/carpoolRecords" element={<CarpoolRecords />} />
            <Route path="/mypage/chatList" element={<ChatList />} />

            <Route path="/post/:id" element={<PostDetail />}  />
            <Route path="/chat" element={<ChatRoom/>}/>

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