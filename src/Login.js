// Login.js
import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
const Login = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleIdChange = (e) => {
        setId(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // 로그인 로직 추가

        try {
            const response = await axios.post('/login/login', {
                id:id,
                pw: password,
            });

            console.log('서버 응답:', response.data);
            // 서버로부터의 응답을 처리하는 로직을 추가할 수 있습니다.
            navigate('/nextPage', { state: { id: id }});
        } catch (error) {
            console.error('에러 발생:', error);
        }
    };



    return (
        <div>
            <h1>로그인 페이지</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    아이디:
                    <input type="text" value={id} onChange={handleIdChange} />
                </label>
                <br />
                <label>
                    비밀번호:
                    <input type="password" value={password} onChange={handlePasswordChange} />
                </label>
                <br />
                <button type="submit">로그인</button>
            </form>
            <p>
                계정이 없으신가요? <Link to="/signup">회원가입</Link>
            </p>
        </div>
    );
};

export default Login;
