import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toursData } from '../data/toursData';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Kattintás a search mezőn kívülre
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Keresési javaslatok frissítése
  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      const searchWord = searchTerm.toLowerCase().trim();
      
      // Keresés a túrák között
      const matchedTours = toursData.filter(tour => 
        tour.varos.toLowerCase().includes(searchWord) ||
        tour.orszag.toLowerCase().includes(searchWord) ||
        tour.cim.toLowerCase().includes(searchWord) ||
        tour.leiras.toLowerCase().includes(searchWord)
      );

      // Egyedi javaslatok létrehozása (városok, országok, túracímek)
      const uniqueSuggestions = [];
      
      // Városok hozzáadása
      matchedTours.forEach(tour => {
        if (tour.varos.toLowerCase().includes(searchWord) && 
            !uniqueSuggestions.some(s => s.text === tour.varos && s.type === 'city')) {
          uniqueSuggestions.push({
            type: 'city',
            text: tour.varos,
            icon: '📍',
            tour: tour
          });
        }
      });

      // Országok hozzáadása
      matchedTours.forEach(tour => {
        if (tour.orszag.toLowerCase().includes(searchWord) && 
            !uniqueSuggestions.some(s => s.text === tour.orszag && s.type === 'country')) {
          uniqueSuggestions.push({
            type: 'country',
            text: tour.orszag,
            icon: '🌍',
            tour: tour
          });
        }
      });

      // Túracímek hozzáadása
      matchedTours.forEach(tour => {
        if (tour.cim.toLowerCase().includes(searchWord) && 
            !uniqueSuggestions.some(s => s.text === tour.cim && s.type === 'tour')) {
          uniqueSuggestions.push({
            type: 'tour',
            text: tour.cim,
            icon: '🍽️',
            tour: tour
          });
        }
      });

      // Limitáljuk a javaslatok számát
      setSuggestions(uniqueSuggestions.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/tours?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setShowSuggestions(false);
      setMenuOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'tour') {
      // Ha egy konkrét túrára kattint, oda visz
      navigate(`/tour/${suggestion.tour.id}`);
    } else {
      // Ha városra vagy országra keres, a tours oldalra visz a kereséssel
      navigate(`/tours?search=${encodeURIComponent(suggestion.text)}`);
    }
    setSearchTerm('');
    setShowSuggestions(false);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => navigate('/')}>
          <h1>GasztroKalandok</h1>
          <p className="tagline">Utazás, falatokkal</p>
        </div>

        <div className="search-wrapper" ref={searchRef}>
          <form onSubmit={handleSearch} className="header-search">
            <input
              type="text"
              placeholder="Keresés város, ország vagy túra alapján..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm.trim().length >= 2 && setShowSuggestions(true)}
              className="header-search-input"
              autoComplete="off"
            />
            <button type="submit" className="header-search-button">
              <span role="img" aria-label="Keresés">🔍</span>
            </button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="suggestion-icon">{suggestion.icon}</span>
                  <div className="suggestion-content">
                    <span className="suggestion-text">{suggestion.text}</span>
                    <span className="suggestion-type">
                      {suggestion.type === 'city' ? 'Város' : 
                       suggestion.type === 'country' ? 'Ország' : 'Túra'}
                    </span>
                  </div>
                </div>
              ))}
              <div className="suggestion-footer">
                <button 
                  className="view-all-results"
                  onClick={() => {
                    navigate(`/tours?search=${encodeURIComponent(searchTerm)}`);
                    setShowSuggestions(false);
                    setSearchTerm('');
                  }}
                >
                  Összes találat megtekintése →
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="header-right">
          <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
            <ul>
              <li><Link to="/">Főoldal</Link></li>
              <li><Link to="/tours">Túrák</Link></li>
              <li><Link to="#about">Rólunk</Link></li>
              <li><Link to="#contact">Kapcsolat</Link></li>
            </ul>
          </nav>

          <div 
            className="profile-container"
            onMouseEnter={() => setProfileMenuOpen(true)}
            onMouseLeave={() => setProfileMenuOpen(false)}
          >
            <button className="profile-icon" aria-label="Profil">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" 
                  fill="currentColor"/>
              </svg>
            </button>
            
            {profileMenuOpen && (
              <div className="profile-menu">
                {isAuthenticated ? (
                  <>
                    <div className="profile-header">
                      <div className="profile-avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="profile-details">
                        <div className="profile-name">{user?.name}</div>
                        <div className="profile-email">{user?.email}</div>
                        <div className="profile-badge">
                          {user?.role === 'admin' ? 'Adminisztrátor' : 'Tag'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="profile-menu-items">
                      <Link to="/profile" className="profile-menu-item" onClick={() => setProfileMenuOpen(false)}>
                        <span className="menu-icon">👤</span>
                        <span className="menu-text">Profilom</span>
                      </Link>
                      
                      <Link to="/profile?tab=bookings" className="profile-menu-item" onClick={() => setProfileMenuOpen(false)}>
                        <span className="menu-icon">📅</span>
                        <span className="menu-text">Foglalásaim</span>
                      </Link>
                      
                      {user?.role === 'admin' && (
                        <Link to="/profile?tab=admin" className="profile-menu-item" onClick={() => setProfileMenuOpen(false)}>
                          <span className="menu-icon">⚙️</span>
                          <span className="menu-text">Admin felület</span>
                        </Link>
                      )}
                      
                      <div className="menu-divider"></div>
                      
                      <button onClick={handleLogout} className="profile-menu-item logout-btn">
                        <span className="menu-icon">🚪</span>
                        <span className="menu-text">Kijelentkezés</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="profile-header">
                      <div className="profile-avatar">👤</div>
                      <div className="profile-details">
                        <div className="profile-name">Vendég</div>
                        <div className="profile-email">Jelentkezz be a foglaláshoz</div>
                      </div>
                    </div>
                    
                    <div className="profile-menu-items">
                      <Link to="/login" className="profile-menu-item" onClick={() => setProfileMenuOpen(false)}>
                        <span className="menu-icon">🔑</span>
                        <span className="menu-text">Bejelentkezés</span>
                      </Link>
                      
                      <Link to="/register" className="profile-menu-item" onClick={() => setProfileMenuOpen(false)}>
                        <span className="menu-icon">📝</span>
                        <span className="menu-text">Regisztráció</span>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <button 
            className="menu-toggle" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;