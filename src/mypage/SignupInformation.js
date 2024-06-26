import React, { useState, useEffect } from 'react';
import '../css/mypage/SignupInformation.css';
import Navbar from '../component/Navbar';

function SignupInformation() {
  const [user, setUser] = useState({
    name: '',
    id: '',
    phoneNumber: '',
    nickname: '',
    birthdate: '',
    avgStar: 0.0,
    profileImage: '' // Initialize as an empty string
  });

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userId = getCookieValue('id');
        const response = await fetch(`/api/user/getUser/${userId}`, {
          method: 'GET', // Assuming you are making a GET request, adjust if necessary
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('사용자 정보를 가져오는 데 실패했습니다');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('사용자 정보를 가져오는 중 오류 발생:', error.message);
      }
    }

    fetchUserData();
  }, []);

  const getCookieValue = (cookieName) => {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split('=');
      if (cookie[0] === cookieName) {
        return cookie[1];
      }
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/user/changeInform', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        throw new Error('사용자 정보 업데이트에 실패했습니다');
      }

      console.log('사용자 정보가 성공적으로 업데이트되었습니다');
      // 여기에서 사용자에게 성공 피드백을 처리할 수 있습니다.
    } catch (error) {
      console.error('사용자 정보 업데이트 중 오류 발생:', error.message);
      // 여기에서 사용자에게 오류 피드백을 처리할 수 있습니다.
    }
  };

  return (
      <div className="page-container">
        <Navbar />
        <div className="subscription-container">
          <h2 className="subscription-title">Subscription information</h2>
          <div className="subscription-form-container">
            <form onSubmit={handleSubmit} className="subscription-form">
              {/* Form fields */}
              <div className="form-group">
                <label htmlFor="profile-image-upload" className="profile-image-upload-label">
                  <p className="profile-image-label">Profile Image</p>
                  <div className="profile-upload-placeholder">

                    {user.profileImage ? (
                        <img src={user.profileImage.replace('/home/ubuntu/images', '/images')} alt="Profile"
                             style={{width: '100%', height: '100%', borderRadius: '50%'}}/>
                    ) : null}
                  </div>
                  <input
                      id="profile-image-upload"
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*" // 이미지 파일만 허용
                      hidden
                  />
                  <div className="profile-image" style={{
                   backgroundImage: `url(${user.profileImage ? user.profileImage.replace('/home/ubuntu/images', '/images') : '/path/to/default/image'})`
                  }}>

                    {/* 프로필 이미지 표시 */}
                  </div>

                </label>
              </div>
              <div className="form-group">
                <label0>Name</label0>
                <input type="text" name="name" value={user.name} onChange={handleChange}/>
              </div>
              <div className="form-group">
                <label1>ID</label1>
                <input type="text" name="id" value={user.id} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label2>Phone Number</label2>
                <input type="text" name="phoneNumber" value={user.phoneNumber} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label3>Birthdate</label3>
                <input type="text" name="birthdate" value={user.birthdate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label4>Nickname</label4>
                <input type="text" name="nickname" value={user.nickname} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label5>Star Rating</label5>
                <input type="text" name="avgStar" value={user.avgStar} readOnly />
              </div>
              <div className="form-actions">
                <button type="submit">Save</button>
                <button type="button">Cancel</button>
              </div>
            </form>
          </div>
        </div>

      </div>
  );
}

export default SignupInformation;