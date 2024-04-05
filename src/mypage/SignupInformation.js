import React, { useState } from 'react';
import '../css/mypage/SignupInformation.css';
import Navbar from '../component/Navbar';

function SignupInformation() {
  const [user, setUser] = useState({
    name: 'Haeun Kim',
    loginID: 'haeun28347',
    nickname: 'haeunzzang',
    address: 'hansung university, seoul',
    phoneNumber: '010-3601-7893'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user);
    // 서버에 데이터를 전송하는 로직을 여기에 구현합니다.
  };

  return (
    <div className="page-container">
      <Navbar />
      <div className="subscription-container">
        <h2 className="subscription-title">Subscription information</h2>
        <div className="subscription-form-container">
          <form onSubmit={handleSubmit} className="subscription-form">
            <div className="profile-image-section">
              <label htmlFor="profile-image-upload" className="profile-image-upload-label">
                <input id="profile-image-upload" type="file" hidden />
                <div className="profile-image" style={{ backgroundImage: 'url("/path/to/image")' }}>
                  {/* 프로필 이미지 또는 아이콘 표시 */}
                </div>
                <div className="upload-icon">+</div>
              </label>
            </div>
            <div className="form-section">
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={user.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>address</label>
                <input type="text" name="address" value={user.address} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Login ID</label>
                <input type="text" name="loginID" value={user.loginID} onChange={handleChange} />
              </div>
              
              
              <div className="form-group">
                <label>phone number</label>
                <input type="text" name="phoneNumber" value={user.phoneNumber} onChange={handleChange} />
              </div>
              
              <div className="form-group">
                <label>Nickname</label>
                <input type="text" name="nickname" value={user.nickname} onChange={handleChange} />
              </div>
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