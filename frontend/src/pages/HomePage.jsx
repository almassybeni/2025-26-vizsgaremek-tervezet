import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toursData, regionsData } from '../data/toursData';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  // Szűrések a kártyákhoz
  const cityWalks = toursData.filter(t => t.type === 'daily').slice(0, 4);
  const upcomingTours = toursData.filter(t => t.type === 'upcoming' || t.type === 'long').slice(0, 4);

  return (
    <div className="homepage-wrapper">
      <Header />

      {/* 1. HERO SZEKCIÓ */}
      <section className="main-hero" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(/src/assets/images/hero-bg.jpg)` }}>
        <div className="hero-inner">
          <h2>Fedezze fel Magyarország<br/>Rejtett Gasztro-Kincseit</h2>
          <button className="hero-learn-btn" onClick={() => navigate('/tours')}>Learn more</button>
        </div>
      </section>

      {/* 2. RÉGIÓ FELFEDEZŐ (Mozaik) */}
      <section className="section-padding white-bg">
        <div className="content-container">
          <h2 className="section-title-left">Régió Felfedező</h2>
          <div className="region-mosaic">
            <div className="mosaic-col-left">
              <div className="mosaic-box small-box" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url(/src/assets/images/${regionsData[0].image})` }} onClick={() => navigate(`/tours?region=${regionsData[0].id}`)}>
                <div className="box-content">
                  <h3>{regionsData[0].name}</h3>
                  <span className="box-btn">Felfedezés</span>
                </div>
              </div>
              <div className="mosaic-box small-box" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url(/src/assets/images/${regionsData[3].image})` }} onClick={() => navigate(`/tours?region=${regionsData[3].id}`)}>
                <div className="box-content">
                  <h3>{regionsData[3].name}</h3>
                  <span className="box-btn">Felfedezés</span>
                </div>
              </div>
            </div>
            <div className="mosaic-col-right">
              <div className="mosaic-box large-box" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url(/src/assets/images/${regionsData[1].image})` }} onClick={() => navigate(`/tours?region=${regionsData[1].id}`)}>
                <div className="box-content">
                  <h3>{regionsData[1].name}</h3>
                  <span className="box-btn">Felfedezés</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VÁROSI SÉTÁK */}
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

      {/* 4. ÉRKEZŐ GASZTRO-KALANDOK (A ToursPage-ről áthozva, a Városi Séták alá) */}
      <section className="section-padding white-bg bottom-section">
        <div className="content-container">
          <div className="section-title-center">
            <h2>🎁 Érkező Gasztro-Kalandok</h2>
            <p>Fedezze fel a legújabb többnapos és kiemelt túráinkat!</p>
          </div>
          
          <div className="tours-grid-4">
            {upcomingTours.map(tour => (
              <div key={tour.id} className="modern-tour-card">
                <div className="tour-img-wrap">
                  <img src={`/src/assets/images/${tour.kep}`} alt={tour.cim} />
                </div>
                <div className="tour-card-body">
                  <h3>{tour.cim}</h3>
                  <p className="tour-subtitle">{tour.sub || 'Gasztronómiai élmény'}</p>
                  <button className="btn-learn-outline" onClick={() => navigate(`/tour/${tour.id}`)}>
                    Learn more
                  </button>
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