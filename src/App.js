// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './component/Header';
import AllPages from './page/AllPages';
import Login from './page/Login';
import SignUp from './page/SignUp';
import RegisterComForm from './community/RegisterComForm';
import Post from './community/Post';
import { ContentProvider } from './community/ContentContext'; // ContentProvider 임포트

function App() {
  return (
    <Router>
      <ContentProvider> {/* ContentProvider 제공 */}
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/registercomform" element={<RegisterComForm />} />
            <Route path="/" element={<AllPagesWithHeader />} />
            <Route path="/post" element={<Post />} />
          </Routes>
        </div>
      </ContentProvider>
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
