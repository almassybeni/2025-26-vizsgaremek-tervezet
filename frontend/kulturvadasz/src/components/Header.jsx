import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'; // Ha a stílusokat külön fájlban tartod

const Header = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="header-left">
          <h1 className="logo-text" onClick={() => navigate('/')}>Culinary Backstreets</h1>
        </div>
        <div className="header-center">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search" />
          </div>
        </div>
        <div className="header-right">
          <div className="profile-trigger" onClick={() => setShowProfile(!showProfile)}>
            <img src="/src/assets/images/user-profile.jpg" alt="Profile" className="user-avatar" onError={(e) => e.target.src = 'https://via.placeholder.com/45'} />
            <span>Pprofile ▾</span>
            {showProfile && (
              <div className="profile-dropdown">
                <div onClick={() => navigate('/profile')}>My profile</div>
                <div onClick={() => navigate('/admin/tours')}>Admin panel</div>
                <div onClick={() => navigate('/login')}>Sign out</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <nav className="site-nav">
        <div className="nav-container">
          <span onClick={() => navigate('/')}>Home</span>
          <span onClick={() => navigate('/tours')}>Felfedező</span>
          <span onClick={() => navigate('/tours')}>Régió fiók</span>
          <span onClick={() => navigate('/tours')}>Gasztró túrák</span>
          <span onClick={() => navigate('/about')}>Legal</span>
          <span onClick={() => navigate('/contact')}>Fontos</span>
        </div>
      </nav>
    </header>
  );
};

export default Header;