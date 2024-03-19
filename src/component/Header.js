import React, { Component } from 'react';
import { Link } from 'react-router-dom'; 
import '../css/Header.css';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrolled: false // 스크롤 여부를 나타내는 상태
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const scrollTop = window.scrollY;
    const isScrolled = scrollTop > 0;
    this.setState({ scrolled: isScrolled });
  };

  //ToCar 제목 클릭 시 홈으로 이동하는 함수
  handleToCarClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 페이지 맨 위로 스크롤
  };

  render() {
    const { scrolled } = this.state;
    return (
      <header className={`Header ${scrolled ? 'scrolled' : ''}`}>
        {/* Link 컴포넌트를 사용하여 홈으로 이동 */}
        <Link to="/" className="ToCar-link" onClick={this.handleToCarClick}>
          <h1>ToCar</h1>
        </Link>
        <Link to="/login" className="Header-button" style={{ textDecoration: 'none' }}>LOGIN / JOIN</Link>
      </header>
    );
  }
}

export default Header;
