import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { toursData, regionsData } from '../data/toursData';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState(null);

  // Szűrések a különböző szekciókhoz
  const dailyToursList = toursData.filter(t => t.type === 'daily').slice(0, 3);
  const longToursList = toursData.filter(t => t.type === 'long');

  return (
    <div className="homepage">
      <Header />
      <Hero />

      {/* --- RÉGIÓ FELFEDEZŐ SZAKASZ --- */}
      <section className="region-explorer">
        <div className="container">
          <div className="section-header">
            <h2>Hová vágysz?</h2>
            <p>Válassz egy tájegységet és ismerd meg a történetét!</p>
          </div>
          <div className="region-grid">
            {regionsData.map(region => (
              <div 
                key={region.id} 
                className="region-card"
                onClick={() => setSelectedRegion(region)}
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url(/src/assets/images/${region.image})` }}
              >
                <h3>{region.name}</h3>
                <span>Részletek →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MODAL (Régió infók) --- */}
      {selectedRegion && (
        <div className="modal-overlay" onClick={() => setSelectedRegion(null)}>
          <div className="region-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedRegion(null)}>×</button>
            <h2>{selectedRegion.name}</h2>
            <div className="modal-body">
              <div className="info-block">
                <h4>📜 Történelem</h4>
                <p>{selectedRegion.history}</p>
              </div>
              <div className="info-block">
                <h4>🍲 Helyi Ízek</h4>
                <p>{selectedRegion.foods}</p>
              </div>
              <div className="info-block">
                <h4>🎯 Mit csinálhatsz itt?</h4>
                <ul>
                  {selectedRegion.activities.map((act, i) => <li key={i}>{act}</li>)}
                </ul>
              </div>
            </div>
            <button className="btn-primary" onClick={() => {
              navigate(`/tours?search=${selectedRegion.name}`);
              setSelectedRegion(null);
            }}>
              Túrák megtekintése ebben a régióban
            </button>
          </div>
        </div>
      )}

      {/* --- HOSSZÚ TÚRÁK SZAKASZ --- */}
      <section className="long-tours-section">
        <div className="container">
          <div className="section-header">
            <h2>Többnapos Gasztro-Kalandok</h2>
            <p>Mélyedj el a kultúrában több napon át</p>
          </div>
          <div className="long-tours-grid">
            {longToursList.map(tour => (
              <div key={tour.id} className="long-tour-card" onClick={() => navigate(`/tour/${tour.id}`)}>
                <div className="long-tour-img-container">
                  <img src={`/src/assets/images/${tour.kep}`} alt={tour.cim} />
                </div>
                <div className="long-tour-content">
                  <span className="tour-badge">Többnapos út</span>
                  <h3>{tour.cim}</h3>
                  <p className="duration">⏳ {tour.idotartam}</p>
                  <p className="description">{tour.leiras}</p>
                  <div className="long-tour-footer">
                    <span className="price">{tour.ar}</span>
                    <button className="btn-secondary">Program megtekintése</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- EGYNAPOS TÚRÁK SZAKASZ --- */}
      <section className="daily-tours-section">
        <div className="container">
          <div className="section-header">
            <h2>Kiemelt Városi Séták</h2>
          </div>
          <div className="tours-grid">
            {dailyToursList.map(tour => (
              <div key={tour.id} className="tour-card" onClick={() => navigate(`/tour/${tour.id}`)}>
                 <div className="tour-image">
                    <img src={`/src/assets/images/${tour.kep}`} alt={tour.cim} />
                 </div>
                 <div className="tour-content">
                    <h3>{tour.cim}</h3>
                    <p>{tour.varos}</p>
                    <div className="tour-footer">
                      <span className="price">{tour.ar}</span>
                      <button className="btn-primary">Részletek</button>
                    </div>
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