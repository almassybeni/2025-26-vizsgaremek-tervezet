import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toursData } from '../data/toursData';
import './ToursPage.css';

const ToursPage = () => {
  const [displayedTours, setDisplayedTours] = useState(toursData);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      setSearchTerm(search);
      searchTours(search);
    } else {
      setDisplayedTours(toursData);
      setSearchTerm('');
    }
  }, [location]);

  const searchTours = (search) => {
    if (!search || search.trim() === '') {
      setDisplayedTours(toursData);
      return;
    }

    const searchWord = search.toLowerCase().trim();
    const filtered = toursData.filter(tour => {
      return (
        tour.varos.toLowerCase().includes(searchWord) ||
        tour.orszag.toLowerCase().includes(searchWord) ||
        tour.cim.toLowerCase().includes(searchWord) ||
        tour.leiras.toLowerCase().includes(searchWord)
      );
    });
    
    setDisplayedTours(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/tours?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/tours');
    }
  };

  const handleTourClick = (tourId) => {
    navigate(`/tour/${tourId}`);
  };

  return (
    <div className="tours-page">
      <Header />
      
      <main>
        <div className="tours-hero">
          <div className="container">
            <h1>Gasztrotúráink</h1>
            <p>Fedezze fel a Kárpát-medence autentikus ízeit</p>
            
            <form onSubmit={handleSearch} className="tours-search-form">
              <input
                type="text"
                placeholder="Keresés város, ország vagy túra alapján..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="tours-search-input"
              />
              <button type="submit" className="tours-search-button">
                Keresés
              </button>
            </form>
          </div>
        </div>

        <section className="tours-section">
          <div className="container">
            {displayedTours.length === 0 ? (
              <div className="no-results">
                <h3>Nincs találat</h3>
                <p>A keresésre "{searchTerm}" nem található túra.</p>
                <button onClick={() => {
                  navigate('/tours');
                }}>
                  Összes túra mutatása
                </button>
              </div>
            ) : (
              <>
                <p className="results-count">
                  {displayedTours.length} túra található
                  {searchTerm && <span> a következő keresésre: "{searchTerm}"</span>}
                </p>
                <div className="tours-grid">
                  {displayedTours.map(tour => (
                    <div key={tour.id} className="tour-card">
                      <div className="tour-image">
                        <img src={`/src/assets/images/${tour.kep}`} alt={tour.cim} />
                        <span className="tour-duration">{tour.idotartam}</span>
                      </div>
                      <div className="tour-content">
                        <div className="tour-location">
                          <span className="tour-city">{tour.varos}</span>
                          <span className="tour-country">{tour.orszag}</span>
                        </div>
                        <h3 className="tour-title">{tour.cim}</h3>
                        <p className="tour-description">{tour.leiras.substring(0, 120)}...</p>
                        <div className="tour-footer">
                          <span className="tour-price">{tour.ar}</span>
                          <button 
                            className="btn-primary" 
                            onClick={() => handleTourClick(tour.id)}
                          >
                            Túra részletei
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ToursPage;