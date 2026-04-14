import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './ToursPage.css';

const ToursPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get('search') || '';

  // 1. ÁLLAPOTOK (Szűrők és Rendezés)
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState('Recommended');

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tours');
        setTours(res.data);
      } catch (err) {
        console.error("Hiba a túrák betöltésekor:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

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
    if (typeof priceString === 'number') return priceString;
    return parseInt(String(priceString || '0').replace(/[^0-9]/g, ''), 10);
  };

  // 3. ADATOK SZŰRÉSE ÉS RENDEZÉSE (useMemo-val, hogy csak változáskor fusson le)
  const displayTours = useMemo(() => {
    let filtered = [...tours];

    // Keresőszöveg alapú szűrés
    if (urlSearchQuery) {
      const query = urlSearchQuery.toLowerCase();
      filtered = filtered.filter(tour => 
        tour.title.toLowerCase().includes(query) || 
        tour.city.toLowerCase().includes(query) ||
        (tour.sub && tour.sub.toLowerCase().includes(query))
      );
    }

    // Destináció szűrés
    if (selectedDestinations.length > 0) {
      filtered = filtered.filter(tour => selectedDestinations.includes(tour.region?.toLowerCase()));
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
    if (sortBy === 'Price (Low to High)' || sortBy === 'Ár (alacsony-magas)') {
      filtered.sort((a, b) => getPriceValue(a.price) - getPriceValue(b.price));
    } else if (sortBy === 'Price (High to Low)' || sortBy === 'Ár (magas-alacsony)') {
      filtered.sort((a, b) => getPriceValue(b.price) - getPriceValue(a.price));
    }

    return filtered;
  }, [tours, selectedDestinations, selectedTypes, sortBy, urlSearchQuery]);


  return (
    <div className="tours-page-wrapper">
      <Header />

      <div className="content-container tours-main-layout">
        
        {/* BAL OLDALSÁV (SZŰRŐK) */}
        <aside className="tours-sidebar">
          <h2 className="sidebar-title">Szűrés</h2>

          <div className="filter-group">
            <h3>Régiók</h3>
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
            <h3>Túra típusa</h3>
            <label className="filter-label">
              <input 
                type="checkbox" 
                checked={selectedTypes.includes('daily')}
                onChange={() => handleTypeChange('daily')}
              /> 
              Városi séták (Egynapos)
            </label>
            <label className="filter-label">
              <input 
                type="checkbox" 
                checked={selectedTypes.includes('multi')}
                onChange={() => handleTypeChange('multi')}
              /> 
              Többnapos túrák
            </label>
          </div>
        </aside>

        {/* JOBB OLDAL: TÚRÁK LISTÁJA */}
        <main className="tours-content-area">
          <div className="tours-top-bar">
            <span>{displayTours.length} találat megjelenítése</span>
            <div className="sort-by">
              Rendezés: 
              <select 
                className="sort-select" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Recommended">Ajánlott</option>
                <option value="Price (Low to High)">Ár (alacsony-magas)</option>
                <option value="Price (High to Low)">Ár (magas-alacsony)</option>
              </select>
            </div>
          </div>

          <div className="tours-grid-3">
            {displayTours.length > 0 ? (
              displayTours.map((tour, index) => (
                <div key={tour.id} className="mag-tour-card" onClick={() => navigate(`/tour/${tour.id}`)}>
                  <div className="mag-tour-img">
                    <img 
                      src={tour.image && (tour.image.startsWith('http') || tour.image.startsWith('data:')) ? tour.image : `/src/assets/images/${tour.image}`} 
                      alt={tour.title} 
                    />
                    
                    {index % 3 === 0 && <span className="badge-bestseller">BEST SELLER</span>}
                    <button className="heart-btn" onClick={(e) => { e.stopPropagation(); alert('Mentve a kedvencek közé!'); }}>♡</button>
                    <div className="brand-circle-small">177</div>
                  </div>

                  <div className="mag-tour-info">
                    <span className="mag-tour-city">{tour.city}</span>
                    <h3 className="mag-tour-title">{tour.title}</h3>
                    <p className="mag-tour-desc">
                      {tour.sub || "A legfinomabb helyi ízek és hagyományok nyomában, szakértő idegenvezetőinkkel."}
                    </p>
                    <div className="mag-tour-price">
                      <strong>{tour.price?.toLocaleString()} Ft</strong> / fő
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