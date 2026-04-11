import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css'; 

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
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
            <span>{isAuthenticated ? (user?.name || 'Profil') : 'Profil'} ▾</span>
            {showProfile && (
              <div className="profile-dropdown">
                {isAuthenticated ? (
                  <>
                    <div onClick={() => { setShowProfile(false); navigate('/profile'); }}>Profilom</div>
                    {user?.role === 'admin' && (
                      <div onClick={() => { setShowProfile(false); navigate('/admin'); }}>Admin felület</div>
                    )}
                    <div onClick={() => { logout(); setShowProfile(false); navigate('/'); }}>Kijelentkezés</div>
                  </>
                ) : (
                  <>
                    <div onClick={() => { setShowProfile(false); navigate('/login'); }}>Bejelentkezés</div>
                    <div onClick={() => { setShowProfile(false); navigate('/register'); }}>Regisztráció</div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <nav className="site-nav">
        <div className="nav-container">
          <span onClick={() => navigate('/')}>Főoldal</span>
          
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