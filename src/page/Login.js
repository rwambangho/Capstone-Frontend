import React from 'react';
import { Link } from 'react-router-dom'; 
import '../css/Login.css';
import chairImage from '../../src/image/chair.PNG'; 

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Log In</h2>
        <form>
          <div className="input-group">
            <input type="email" id="email" required placeholder="Your email" />
          </div>
          <div className="input-group">
            <input type="password" id="password" required placeholder="Password" />
          </div>
          <button type="submit">Log In</button>
          <a href="/forgot">Forgot password?</a>
          <div className="separator">or</div>
          <button type="button" className="kakao-login">카카오톡</button>
        </form>
        <div className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
      <div className="login-image">
        <img src={chairImage} alt="chair" className="chair-image" />
      </div>
    </div>
  );
};

export default Login;
