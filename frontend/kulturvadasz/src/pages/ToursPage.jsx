import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toursData } from '../data/toursData';
import './ToursPage.css';

const ToursPage = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  // Két kategóriára bontjuk a túrákat a kép alapján
  const upcomingTours = toursData.filter(t => t.type === 'upcoming' || t.type === 'long').slice(0, 4);
  const cityWalks = toursData.filter(t => t.type === 'daily').slice(0, 4);

  return (
    <div className="tours-page-wrapper">
      {/* FEJLÉC ÉS MENÜ */}
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

      {/* 1. SZEKCIÓ: ÉRKEZŐ GASZTRO-KALANDOK */}
      <section className="tours-section">
        <div className="content-container">
          <div className="section-title-center">
            <h2>🎁 Érkező Gasztro-Kalandok - Már Foglalhatók!</h2>
            <p>Legyen az elsők között, akik kipróbálják új élményeinket!</p>
          </div>
          
          <div className="tours-grid-4">
            {upcomingTours.map(tour => (
              <div key={tour.id} className="modern-tour-card">
                <div className="tour-img-wrap">
                  <img src={`/src/assets/images/${tour.kep}`} alt={tour.cim} />
                </div>
                <div className="tour-card-body">
                  <h3>{tour.cim}</h3>
                  <p className="tour-subtitle">Új! Borvacsora Tokajban</p>
                  <button className="btn-learn-outline" onClick={() => navigate(`/tour/${tour.id}`)}>
                    Learn more
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. SZEKCIÓ: VÁROSI SÉTÁK */}
      <section className="tours-section bottom-section">
        <div className="content-container">
          <div className="section-title-center">
            <h2>Városi Séták</h2>
          </div>
          
          <div className="tours-grid-4">
            {cityWalks.map(tour => (
              <div key={tour.id} className="simple-tour-card" onClick={() => navigate(`/tour/${tour.id}`)}>
                <div className="simple-img-wrap">
                  <img src={`/src/assets/images/${tour.kep}`} alt={tour.cim} />
                </div>
                <div className="simple-label">
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

export default ToursPage;