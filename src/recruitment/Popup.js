// Popup.js
import React, { useState } from 'react';
import '../css/recruitment/Popup.css';

function Popup({ onClose }) {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [uniqueNumber, setUniqueNumber] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // 팝업 폼의 데이터를 처리하거나 API로 보낼 수 있음
    console.log({ licenseNumber, name, birthdate, uniqueNumber });
    onClose(); // 폼을 제출한 후 팝업 닫기
  };

  return (
    <div className="popup-container">
      <div className="popup">
        <button className="popup-close-btn" onClick={onClose}>×</button>
        <h2>Write down your driver license</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group-text">
            <label>License Number ('-' mandatory)</label>
            <input
              type="text"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder="ex)00-00-000000-00"
              required
            />
          </div>
          <div className="input-group-text">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex) lee yurim"
              required
            />
          </div>
          <div className="input-group-text">
            <label>Birthdate</label>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              required
            />
          </div>
          <div className="input-group-text">
            <label>Identity number</label>
            <input
              type="text"
              value={uniqueNumber}
              onChange={(e) => setUniqueNumber(e.target.value)}
              placeholder="ex)fill in your identity number"
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Popup;
