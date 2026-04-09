import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toursData } from '../data/toursData';
import './ToursPage.css';

const ToursPage = () => {
  const navigate = useNavigate();

  // 1. ÁLLAPOTOK (Szűrők és Rendezés)
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState('Recommended');

  // 2. SZŰRŐ KEZELŐ FÜGGVÉNYEK
  const handleDestinationChange = (regionId) => {
    setSelectedDestinations(prev => 
      prev.includes(regionId) 
        ? prev.filter(id => id !== regionId) 
        : [...prev, regionId]
    );
  };

  const handleTypeChange = (typeId) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId) 
        : [...prev, typeId]
    );
  };

  // Segédfüggvény az ár számmá alakításához ("18 900 Ft" -> 18900)
  const getPriceValue = (priceString) => {
    if (!priceString) return 0;
    return parseInt(priceString.replace(/[^0-9]/g, ''), 10);
  };

  // 3. ADATOK SZŰRÉSE ÉS RENDEZÉSE (useMemo-val, hogy csak változáskor fusson le)
  const displayTours = useMemo(() => {
    let filtered = toursData;

    // Destináció szűrés
    if (selectedDestinations.length > 0) {
      filtered = filtered.filter(tour => selectedDestinations.includes(tour.region));
    }

    // Típus szűrés (A "Multi-Day"-be belevesszük a 'long' és 'upcoming' típusokat is)
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(tour => {
        if (selectedTypes.includes('daily') && tour.type === 'daily') return true;
        if (selectedTypes.includes('multi') && (tour.type === 'long' || tour.type === 'upcoming')) return true;
        return false;
      });
    }

    // Rendezés
    if (sortBy === 'Price (Low to High)') {
      filtered.sort((a, b) => getPriceValue(a.ar) - getPriceValue(b.ar));
    } else if (sortBy === 'Price (High to Low)') {
      filtered.sort((a, b) => getPriceValue(b.ar) - getPriceValue(a.ar));
    }

    return filtered;
  }, [selectedDestinations, selectedTypes, sortBy]);


  return (
    <div className="tours-page-wrapper">
      <Header />

      <div className="content-container tours-main-layout">
        
        {/* BAL OLDALSÁV (SZŰRŐK) */}
        <aside className="tours-sidebar">
          <h2 className="sidebar-title">Refine Your Search</h2>

          <div className="filter-group">
            <h3>Destinations</h3>
            <label className="filter-label">
              <input 
                type="checkbox" 
                checked={selectedDestinations.includes('budapest')}
                onChange={() => handleDestinationChange('budapest')}
              /> 
              Budapest
            </label>
            <label className="filter-label">
              <input 
                type="checkbox" 
                checked={selectedDestinations.includes('tokaj')}
                onChange={() => handleDestinationChange('tokaj')}
              /> 
              Tokaj & Észak
            </label>
            <label className="filter-label">
              <input 
                type="checkbox" 
                checked={selectedDestinations.includes('balaton')}
                onChange={() => handleDestinationChange('balaton')}
              /> 
              Balaton-felvidék
            </label>
            <label className="filter-label">
              <input 
                type="checkbox" 
                checked={selectedDestinations.includes('alfold')}
                onChange={() => handleDestinationChange('alfold')}
              /> 
              Dél-Alföld & Puszta
            </label>
          </div>

          <div className="filter-group">
            <h3>Trip Type</h3>
            <label className="filter-label">
              <input 
                type="checkbox" 
                checked={selectedTypes.includes('daily')}
                onChange={() => handleTypeChange('daily')}
              /> 
              Day Trips (Városi séták)
            </label>
            <label className="filter-label">
              <input 
                type="checkbox" 
                checked={selectedTypes.includes('multi')}
                onChange={() => handleTypeChange('multi')}
              /> 
              Multi-Day Trips (Többnapos)
            </label>
          </div>
        </aside>

        {/* JOBB OLDAL: TÚRÁK LISTÁJA */}
        <main className="tours-content-area">
          <div className="tours-top-bar">
            <span>Showing {displayTours.length} results</span>
            <div className="sort-by">
              Sort by: 
              <select 
                className="sort-select" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Recommended">Recommended</option>
                <option value="Price (Low to High)">Price (Low to High)</option>
                <option value="Price (High to Low)">Price (High to Low)</option>
              </select>
            </div>
          </div>

          <div className="tours-grid-3">
            {displayTours.length > 0 ? (
              displayTours.map((tour, index) => (
                <div key={tour.id} className="mag-tour-card" onClick={() => navigate(`/tour/${tour.id}`)}>
                  <div className="mag-tour-img">
                    <img src={`/src/assets/images/${tour.kep}`} alt={tour.cim} />
                    
                    {index % 3 === 0 && <span className="badge-bestseller">BEST SELLER</span>}
                    <button className="heart-btn" onClick={(e) => { e.stopPropagation(); alert('Mentve a kedvencek közé!'); }}>♡</button>
                    <div className="brand-circle-small">177</div>
                  </div>

                  <div className="mag-tour-info">
                    <span className="mag-tour-city">{tour.varos}</span>
                    <h3 className="mag-tour-title">{tour.cim}</h3>
                    <p className="mag-tour-desc">
                      {tour.sub || "A legfinomabb helyi ízek és hagyományok nyomában, szakértő idegenvezetőinkkel."}
                    </p>
                    <div className="mag-tour-price">
                      <strong>{tour.ar}</strong> per adult
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: '#666' }}>
                <h3>Nem találtunk a szűrésnek megfelelő túrát.</h3>
                <p>Kérjük, módosítson a szűrési feltételeken!</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ToursPage;