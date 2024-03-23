// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './component/Header';
import AllPages from './page/AllPages';
import Login from './page/Login';
import SignUp from './page/SignUp';
import RegisterComForm from './community/RegisterComForm';
import Post from './community/Post';
import Jejudo1 from './main/Jejudo1';




function App() {
  return (
    <Router>

        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/registercomform" element={<RegisterComForm />} />
            <Route path="/" element={<AllPagesWithHeader />} />
            <Route path="/post" element={<Post />} />
            <Route path="/main" element={<Jejudo1 />} /> 
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
