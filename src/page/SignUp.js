import React from 'react';
import { Link } from 'react-router-dom'; 
import '../css/SignUp.css';
import chairImage from '../../src/image/chair.PNG'; 

const SignUp = () => {
  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Sign Up</h2>
        <form>
          <div className="input-group">
            <input type="email" id="email" required placeholder="Your email" />
          </div>
          <div className="input-group">
            <input type="password" id="password" required placeholder="Password" />
          </div>
          <div className="input-group">
            <input type="password" id="password" required placeholder="Repeat Password" />
          </div>
          <button type="submit">Sign Up</button>
          <div className="separator">or</div>
          <button type="button" className="kakao-login">카카오톡</button>
        </form>
        <div className="signup-link">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
      <div className="signup-image">
        <img src={chairImage} alt="chair" className="chair-image" />
      </div>
    </div>
  );
};

export default SignUp;
