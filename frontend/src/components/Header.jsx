import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toursData } from '../data/toursData';
import './Header.css'; 

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  // Bezárjuk a javaslatokat, ha mellékattintunk
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/tours?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(''); // Keresés után ürítjük a mezőt
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 0) {
      // Szűrés a cím (cim) és a város (varos) alapján
      const filtered = toursData.filter(tour => 
        tour.cim.toLowerCase().includes(value.toLowerCase()) ||
        tour.varos.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Csak az első 5 találatot mutatjuk
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <header className="site-header">
     

      <div className="header-container">
        <div className="header-left">
          <h1 className="logo-text" onClick={() => navigate('/')}>Culinary Backstreets</h1>
        </div>
        <div className="header-center">
          <div className="search-input-wrapper" ref={searchRef}>
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Keresés..." 
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleSearch}
            />
            {suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map(tour => (
                  <div 
                    key={tour.id} 
                    className="suggestion-item"
                    onClick={() => {
                      navigate(`/tour/${tour.id}`);
                      setSearchTerm('');
                      setSuggestions([]);
                    }}
                  >
                    <span className="suggestion-text">{tour.cim} <small>({tour.varos})</small></span>
                  </div>
                ))}
              </div>
            )}
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