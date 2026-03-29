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

  // Szűrések
  const dailyTours = toursData.filter(t => t.type === 'daily').slice(0, 3);
  const longTours = toursData.filter(t => t.type === 'long');
 console.log("Túrák adatai:", toursData);
console.log("Régiók adatai:", regionsData);

if (!toursData || !regionsData) {
  return <div>Adatok betöltése... Ellenőrizd a toursData.js fájlt!</div>;
}
  

  return (
    <div className="homepage">
      <Header />
      <Hero />

      {/* 1. RÉGIÓ FELFEDEZŐ (KOCKÁK) */}
      <section className="region-explorer">
        <div className="container">
          <div className="section-header">
            <h2>Fedezze fel tájegységeinket</h2>
            <p>Kattintson egy régióra a történetért és helyi ízekért</p>
          </div>
          <div className="region-grid">
            {regionsData.map(region => (
              <div 
                key={region.id} 
                className="region-card"
                onClick={() => setSelectedRegion(region)}
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(/src/assets/images/${region.image})` }}
              >
                <h3>{region.name}</h3>
                <span>Felfedezés →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REGION MODAL (Ha ki van választva egy régió) */}
      {selectedRegion && (
        <div className="modal-overlay" onClick={() => setSelectedRegion(null)}>
          <div className="region-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedRegion(null)}>×</button>
            <div className="modal-content">
              <h2>{selectedRegion.name}</h2>
              <div className="modal-grid">
                <div className="modal-info">
                  <h4>Történet</h4>
                  <p>{selectedRegion.history}</p>
                  <h4>Ikonikus Ételek</h4>
                  <p>{selectedRegion.foods}</p>
                </div>
                <div className="modal-actions">
                  <h4>Mit csinálhat itt?</h4>
                  <ul>
                    {selectedRegion.activities.map((act, i) => <li key={i}>✨ {act}</li>)}
                  </ul>
                  <button className="btn-primary" onClick={() => navigate(`/tours?search=${selectedRegion.name}`)}>
                    Túrák keresése itt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. HOSSZÚ TÚRÁK SZEKCIÓ */}
      <section className="long-tours-section">
        <div className="container">
          <div className="section-header">
            <span className="badge">Prémium Élmény</span>
            <h2>Többnapos Gasztro-Kalandok</h2>
            <p>Mélyedjen el a kultúrában és az ízekben több napon át</p>
          </div>
          <div className="long-tours-grid">
            {longTours.map(tour => (
              <div key={tour.id} className="long-tour-card" onClick={() => navigate(`/tour/${tour.id}`)}>
                <div className="long-tour-image">
                  <img src={`/src/assets/images/${tour.kep}`} alt={tour.cim} />
                  <div className="tour-tag">Hosszú Túra</div>
                </div>
                <div className="long-tour-info">
                  <h3>{tour.cim}</h3>
                  <p className="duration">📅 {tour.idotartam}</p>
                  <p className="description">{tour.leiras}</p>
                  <div className="long-tour-footer">
                    <span className="price">{tour.ar}</span>
                    <button className="btn-secondary">Részletes Program</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. NAPI TÚRÁK (A meglévő szekciód) */}
      <section className="featured-tours">
        <div className="container">
          <div className="section-header">
            <h2>Egynapos Városi Séták</h2>
          </div>
          <div className="tours-grid">
            {dailyTours.map(tour => (
              <div key={tour.id} className="tour-card" onClick={() => navigate(`/tour/${tour.id}`)}>
                {/* ... a meglévő kártya kódod ... */}
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