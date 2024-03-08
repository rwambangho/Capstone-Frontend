// NextPage.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const NextPage = () => {
    const location = useLocation();
    const { state } = location;
    const [message, setMessage] = useState('');

    useEffect(() => {
        // state에서 필요한 데이터 추출
        const { id } = state;

        // 서버에서 데이터를 가져오는 예제
        const fetchData = async () => {
            try {
                const response = await axios.get(`/login/signUp-ok?id=${id}`); // 엔드포인트 및 쿼리스트링 적절하게 수정
                setMessage(response.data);
            } catch (error) {
                console.error('에러 발생:', error);
            }
        };

        fetchData();
    }, [state]);

    return (
        <div>
            <h1>다음 페이지</h1>
            <p>서버에서 받은 메시지: {message}</p>
        </div>
    );
};

export default NextPage;
