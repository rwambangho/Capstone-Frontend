import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Header from './component/Header';
import AllPages from './page/AllPages'; // 하나의 컴포넌트로 모든 페이지를 통합
import Login from './page/Login';
import SignUp from './page/SignUp';


function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AllPages />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
