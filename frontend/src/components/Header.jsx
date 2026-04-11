import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'; 

const Header = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showExplore, setShowExplore] = useState(false);

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
            <img 
              src="/src/assets/images/user-profile.jpg" 
              alt="Profile" 
              className="user-avatar" 
              onError={(e) => e.target.src = 'https://via.placeholder.com/45'} 
            />
            <span>Profile ▾</span>
            {showProfile && (
              <div className="profile-dropdown">
                <div onClick={() => navigate('/profile')}>My profile</div>
                <div onClick={() => navigate('/admin')}>Admin panel</div>
                <div onClick={() => navigate('/login')}>Sign out</div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <nav className="site-nav">
        <div className="nav-container">
          <span onClick={() => navigate('/')}>Home</span>
          
          <div 
            className="nav-item-with-dropdown"
            onMouseEnter={() => setShowExplore(true)}
            onMouseLeave={() => setShowExplore(false)}
          >
            <span className="nav-link">Régiók ▾</span>
            
            {showExplore && (
              <div className="explore-mega-menu" style={{ width: 'max-content', minWidth: '180px', padding: '10px' }}>
                <div className="mega-menu-container" style={{ display: 'block', padding: '0' }}>
                  <div className="mega-column">
                    <span onClick={() => navigate('/region?region=budapest')}>Budapest</span>
                    <span onClick={() => navigate('/region?region=tokaj')}>Tokaj & Észak</span>
                    <span onClick={() => navigate('/region?region=balaton')}>Balaton-felvidék</span>
                    <span onClick={() => navigate('/region?region=alfold')}>Dél-Alföld & Puszta</span>
                    <span onClick={() => navigate('/region?region=tokaj')}>Eger</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <span onClick={() => navigate('/tours')}>Túrák</span>
          <span onClick={() => navigate('/about')}>Rólunk</span>
          <span onClick={() => navigate('/contact')}>Kapcsolat</span>
        </div>
      </nav>
    </header>
  );
};

export default Header;