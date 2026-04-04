import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toursData } from '../data/toursData';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  // Csak a napi túrákat (Városi Séták) listázzuk alul
  const cityWalks = toursData.filter(t => t.type === 'daily').slice(0, 4);

  return (
    <div className="homepage-wrapper">
      
      {/* 1. FEJLÉC ÉS MENÜ (A kép alapján) */}
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
              <img src="/src/assets/images/user-profile.jpg" alt="Profile" className="user-avatar" />
              <span>Pprofile ▾</span>
              {showProfile && (
                <div className="profile-dropdown">
                  <div onClick={() => navigate('/profile')}>My profile</div>
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

      {/* 2. HERO SZEKCIÓ (Teljes szélességű nagy kép) */}
      <section className="main-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(/src/assets/images/hero-bg.jpg)` }}>
        <div className="hero-inner">
          <h2>Fedezze fel Magyarország<br/>Rejtett Gasztro-Kincseit</h2>
          <button className="hero-learn-btn" onClick={() => navigate('/tours')}>Learn more</button>
        </div>
      </section>

      {/* 3. RÉGIÓ FELFEDEZŐ (Mozaik: balra 2 kicsi, jobbra 1 nagy) */}
      <section className="section-padding white-bg">
        <div className="content-container">
          <h2 className="section-title-left">Régió Felfedező</h2>
          
          <div className="region-mosaic">
            {/* Bal oldali oszlop (2 kisebb kép) */}
            <div className="mosaic-col-left">
              <div 
                className="mosaic-box small-box" 
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url(/src/assets/images/tokaj-wine.jpg)` }}
                onClick={() => navigate('/tours?region=tokaj')}
              >
                <div className="box-content">
                  <h3>Régió Felfedező</h3>
                  <span className="box-btn">Régió Felfedező</span>
                </div>
              </div>

              <div 
                className="mosaic-box small-box" 
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url(/src/assets/images/budapest-market.jpg)` }}
                onClick={() => navigate('/tours')}
              >
                <div className="box-content">
                  <h3>Hosszú Túrák</h3>
                  <span className="box-btn">Hosszú Túrák</span>
                </div>
              </div>
            </div>

            {/* Jobb oldali oszlop (1 nagy kép) */}
            <div className="mosaic-col-right">
              <div 
                className="mosaic-box large-box" 
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url(/src/assets/images/balaton-felvidek.jpg)` }}
                onClick={() => navigate('/tours?region=balaton')}
              >
                <div className="box-content">
                  <h3>Hosszú Túrák</h3>
                  <span className="box-btn">Hosszú Túrák</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VÁROSI SÉTÁK (Túra kártyák legalul) */}
      <section className="section-padding white-bg">
        <div className="content-container">
          <h2 className="section-title-center">Városi Séták</h2>
          
          <div className="city-grid">
            {cityWalks.map(tour => (
              <div key={tour.id} className="city-card" onClick={() => navigate(`/tour/${tour.id}`)}>
                <div className="city-img-wrap">
                  <img src={`/src/assets/images/${tour.kep}`} alt={tour.cim} />
                </div>
                <div className="city-label">
                  <p>{tour.varos} Séták</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;