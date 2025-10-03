import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import './Header.css';

const Header = () => {
  const { userData } = useContext(AppContext);

  return (
    <div className="header">
      <img src={assets.header} alt="User" className="header-img" />
      <h1 className="header-title">
        Hey {userData ? userData.name : 'Food Lover'}!
      </h1>
      <h2 className="header-subtitle">Welcome to Recipedia</h2>
      <p className="header-text">
        Discover, cook, and enjoy amazing recipes from around the world. Let's get started!
      </p>
      <button className="header-btn">Explore Recipes</button>
    </div>
  );
};

export default Header;
