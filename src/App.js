import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignUp from './SignUp';
import Login from './Login';
import NextPage from './NextPage';
import MapComponent from "./map";

function App() {
    return (

        <Router>

            <div className="App">

                <nav>
                    <ul>
                        <li>
                            <Link to="/signup">회원가입</Link>
                        </li>
                        <li>
                            <Link to="/login">로그인</Link>
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/nextPage" element={<NextPage />} />
                </Routes>
            </div>
            <MapComponent/>
        </Router>
    );
}
//카카오맵 연결

export default App;
