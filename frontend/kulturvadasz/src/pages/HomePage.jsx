import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { toursData, regionsData } from '../data/toursData';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  // Csoportosítás a kép elrendezése szerint
  const upcomingTours = toursData.slice(0, 4); // Érkező gasztro-kalandok
  const cityWalks = toursData.filter(t => t.type === 'daily').slice(0, 4);

  return (
    <div className="homepage">
      <Header />
      <Hero />

      <div className="container">
        {/* 1. SZEKCIÓ: ÉRKEZŐ GASZTRO-KALANDOK (Fehér kártyák árnyékkal) */}
        <section className="upcoming-section">
          <div className="section-title-center">
            <h2>🎁 Érkező Gasztro-Kalandok - Már Foglalhatók!</h2>
            <p>Legyen az elsők között, akik kipróbálják új élményeinket!</p>
          </div>
          
          <div className="modern-grid">
            {upcomingTours.map(tour => (
              <div key={tour.id} className="modern-card">
                <div className="card-img-wrap">
                  <img src={`/src/assets/images/${tour.kep}`} alt={tour.cim} />
                </div>
                <div className="card-body">
                  <h3>{tour.cim}</h3>
                  <p className="card-sub">{tour.varos}</p>
                  <button className="btn-outline-small" onClick={() => navigate(`/tour/${tour.id}`)}>
                    Learn more
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. SZEKCIÓ: RÉGIÓ FELFEDEZŐ (Nagyobb boxok, szöveg a képen) */}
        <section className="region-section">
          <h2 className="section-title-left">Régió Felfedező</h2>
          <div className="region-mosaic">
            {regionsData.map((reg, index) => (
              <div 
                key={reg.id} 
                className={`region-box ${index === 0 ? 'large' : ''}`}
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.4)), url(/src/assets/images/${reg.image})` }}
                onClick={() => navigate(`/tours?region=${reg.id}`)}
              >
                <div className="region-box-content">
                  <h3>{reg.name}</h3>
                  <span className="box-tag">Régió Felfedező</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. SZEKCIÓ: VÁROSI SÉTÁK (Vízszintesebb kártyák) */}
        <section className="city-section">
          <div className="section-title-center">
            <h2>Városi Séták</h2>
          </div>
          <div className="modern-grid">
            {cityWalks.map(tour => (
              <div key={tour.id} className="modern-card">
                <div className="card-img-wrap">
                  <img src={`/src/assets/images/${tour.kep}`} alt={tour.cim} />
                </div>
                <div className="card-body-simple">
                  <p className="city-name">{tour.varos} Séták</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;