import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/MyPage.css';
import Navbar from '../component/Navbar';
import axios from 'axios';

function CarpoolRecords() {
  // 데이터를 저장할 상태 변수 선언
  const [data, setData] = useState([]);
  const [user,setUser]=useState(getCookieValue("nickname"));
  const [contents, setContents]=useState('');
  
  const handleRating = (userId, star) => {
    axios.put(`/recruits/star`, { id: userId , star: star})
      .then(() => {
        console.log(parseFloat(star));
        console.log(userId);
        const updatedData = data.map(item => {
          if (item.userId === userId) {
            return { ...item, star }; 
          }
          return item;
        });
        setData(updatedData);
      })
      .catch(error => console.error('Rating update failed:', error));
  };
  const StarRating = ({ starsSelected = 0.0, totalStars = 5.0, onRate = f => f }) => {
    return (
      <div className="star-rating">
        {[...Array(totalStars)].map((n, i) =>
          <Star key={i}
                selected={i < starsSelected}
                onClick={() => onRate(i + 1)}
          />
        )}
      </div>
    );
  };
  const Star = ({ selected = false, onClick = f => f }) => (
    <div className={(selected ? 'star selected' : 'star')} onClick={onClick}>
      ★
    </div>
  );

  // 컴포넌트가 마운트될 때 GET 요청 보내기
  useEffect(() => {
   
    axios.get('/recruits/records',{

      params:{
        nickname:user,
        contents:contents
        
      }


    })
      .then(response => {
        // 성공적으로 데이터를 받아온 경우 상태 업데이트
        setData(response.data);
      })
      .catch(error => {
        // 오류 처리
        console.error('Error fetching data:', error);
      });
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행되도록 함

  function getCookieValue(cookieName) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split('=');
        if (cookie[0] === cookieName) {
            return cookie[1];
        }
    }
    return null;
}


  return (
    <div>
      <Navbar />
      <h1>Carpool Records</h1>
      {/* 데이터를 사용하여 원하는 UI 표시 */}
      <ul>
        {data.map(item => (
          <li key={item.id}>
            <Link to={`/booking/${item.idxNum}`}>{item.nickname} - {item.title}</Link>
            <StarRating starsSelected={item.star} onRate={star => handleRating(item.id, star)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CarpoolRecords;