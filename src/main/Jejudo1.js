// jejudo1.js
import React, { useEffect } from 'react';
import { useState } from 'react';
import Navbar from '../component/Navbar';
import '../css/main/jejudo1.css';


export default function Jejudo() {
  const [position, setPosition] = useState(0);

  function onScroll() {
    setPosition(window.scrollY);
  }
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="home-background">
      <Navbar />
      <div className="title-container"
      style={{
        transform : 'translateX(${-position}px',
      }}>
        <h1>JEJUDO</h1>
        <button className='scroll-down-bt'>Please scroll down</button>
      </div>
    
    <p 
      className="desc"
      style={{
        transform : 'translateX(${position}px',
      }}
    >
      Nestled off the southern coast of South Korea lies a hidden gem awaiting discovery - Jeju Island.
      As an avid traveler seeking new adventures, I recently embarked on a journey to this picturesque island, eager to
      explore its natural wonders and cultural treasures... Nestled off the southern coast of South Korea lies 
      a hidden gem awaiting discovery - Jeju Island. As an avid traveler seeking new adventures, I recently embarked...

    </p>
    </div>
  );
}

