import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toursData, regionsData } from '../data/toursData';
import './ToursPage.css';

const ToursPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [filteredTours, setFilteredTours] = useState([]);
  const [activeRegion, setActiveRegion] = useState(null);
  const [filters, setFilters] = useState({ type: 'all', maxPrice: 300000 });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const regionId = params.get('region');
    
    // Régió és Történelem beállítása
    if (regionId && regionsData) {
      const region = regionsData.find(r => r.id === regionId);
      setActiveRegion(region || null);
    } else {
      setActiveRegion(null);
    }

    // Szűrés
    let result = toursData || [];

    if (regionId) {
      result = result.filter(t => t.region === regionId);
    }

    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type);
    }

    // Ár szűrés biztonságosan
    result = result.filter(t => {
      const priceNum = parseInt(String(t.ar).replace(/[^0-9]/g, '')) || 0;
      return priceNum <= filters.maxPrice;
    });

    setFilteredTours(result);
  }, [location.search, filters]);

  return (
    <div className="tours-page">
      <Header />
      
      {activeRegion && (
        <div className="region-intro-section">
          <div className="container">
            <div className="region-header-flex">
              <div className="region-text">
                <span className="breadcrumb" onClick={() => navigate('/tours')}>← Összes túra</span>
                <h1>{activeRegion.name}</h1>
                <p className="history-text">{activeRegion.history}</p>
              </div>
              <div className="region-img">
                 <img src={`/src/assets/images/${activeRegion.image}`} alt={activeRegion.name} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container tours-layout">
        <aside className="filter-sidebar">
          <h3>Szűrők</h3>
          <div className="filter-group">
            <label>Típus</label>
            <select value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})}>
              <option value="all">Összes</option>
              <option value="daily">Egynapos</option>
              <option value="long">Többnapos</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Max ár: {Number(filters.maxPrice).toLocaleString()} Ft</label>
            <input 
              type="range" min="10000" max="300000" step="5000"
              value={filters.maxPrice}
              onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} 
            />
          </div>
        </aside>

        <main className="tours-main">
          <h2>Találatok ({filteredTours.length})</h2>
          <div className="tours-grid">
            {filteredTours.map(tour => (
              <div key={tour.id} className="tour-card" onClick={() => navigate(`/tour/${tour.id}`)}>
                <div className="tour-image"><img src={`/src/assets/images/${tour.kep}`} alt={tour.cim} /></div>
                <div className="tour-content">
                  <span className="city-label">{tour.varos}</span>
                  <h3>{tour.cim}</h3>
                  <div className="tour-footer">
                    <span className="price">{tour.ar}</span>
                    <button className="btn-primary">Részletek</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ToursPage;