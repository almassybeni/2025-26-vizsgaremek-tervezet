import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'; 

const Header = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showExplore, setShowExplore] = useState(false); // Új állapot a felfedezőhöz

  return (
    <header className="site-header">
      <div className="top-banner">
        <div className="top-banner-container">
          <span className="banner-text">
            IMMERSIVE MULTI-DAY JOURNEYS IN AND AROUND THE WORLD'S CULINARY CAPITALS
          </span>
          <span className="banner-link" onClick={() => navigate('/about')}>
            Learn more about our trips
          </span>
        </div>
      </div>

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
          
          {/* FELFEDEZŐ MENÜPONT LENYÍLÓVAL */}
          <div 
            className="nav-item-with-dropdown"
            onMouseEnter={() => setShowExplore(true)}
            onMouseLeave={() => setShowExplore(false)}
          >
            <span className="nav-link">Felfedező ▾</span>
            
            {showExplore && (
              <div className="explore-mega-menu">
                <div className="mega-menu-container">
                  <div className="mega-column">
                    <h4>Destinations</h4>
                    <span onClick={() => navigate('/tours?region=budapest')}>Budapest</span>
                    <span onClick={() => navigate('/tours?region=tokaj')}>Tokaj & Észak</span>
                    <span onClick={() => navigate('/tours?region=balaton')}>Balaton-felvidék</span>
                    <span onClick={() => navigate('/tours?region=alfold')}>Dél-Alföld & Puszta</span>
                    <span onClick={() => navigate('/tours?region=tokaj')}>Eger</span>
                  </div>
                  <div className="mega-column">
                    <h4>Themes</h4>
                    <span onClick={() => navigate('/tours')}>Food & Drink</span>
                    <span onClick={() => navigate('/tours')}>Cooking Classes</span>
                    <span onClick={() => navigate('/tours')}>Neighborhoods</span>
                  </div>
                  <div className="mega-column">
                    <h4>Trip Type</h4>
                    <span onClick={() => navigate('/tours')}>Day Trips</span>
                    <span onClick={() => navigate('/tours')}>Multi-Day Trips</span>
                  </div>
                </div>
              </div>
            )}
          </div>

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