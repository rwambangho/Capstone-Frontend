// SignUp.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const SignUp = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');

    const navigate = useNavigate();


    const handleIdChange = (e) => {
        setId(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleAgeChange = (e) => {
        setAge(e.target.value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // 여기에서 실제 서버의 HTTPS 엔드포인트를 사용하도록 수정합니다.
            const response = await axios.post('/login/signUp', {
                id:id,
                pw: password,
                username: username,
                age:age,
            });

            console.log('서버 응답:', response.data);
            // 서버로부터의 응답을 처리하는 로직을 추가할 수 있습니다.
            navigate('/nextPage', { state: { id: id } });
        } catch (error) {
            console.error('에러 발생:', error);
        }
    };

    return (
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
            <label>
                이름:
                <input type="text" value={username} onChange={handleUsernameChange} />
            </label>
            <label>
                나이:
                <input type="text" value={age} onChange={handleAgeChange} />
            </label>
            <br />
            <button type="submit">회원가입</button>
        </form>
    );
};

export default SignUp;
