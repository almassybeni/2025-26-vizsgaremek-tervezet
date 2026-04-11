import React, { useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toursData, regionsData } from '../data/toursData';
import './RegionPage.css';
import './ToursPage.css'; // Beimportáljuk a ToursPage stílusait a kártyákhoz

const RegionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Görgetés az oldal tetejére navigációkor
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const queryParams = new URLSearchParams(location.search);
  const regionKey = queryParams.get('region') || 'budapest';

  // Megkeressük a régió statikus adatait (kép, leírás)
  const currentRegion = regionsData.find(r => r.id === regionKey) || regionsData[0];

  // Szűrjük a túrákat csak az adott régióra (useMemo-val a teljesítményért)
  const filteredTours = useMemo(() => {
    return toursData.filter(tour => tour.region === regionKey);
  }, [regionKey]);

  return (
    <div className="region-page-wrapper">
      <Header />
      
      <div className="content-container">
        {/* FELSŐ RÉSZ: Szöveg balra, kép jobbra */}
        <section className="region-hero-container">
          <div className="region-hero-content">
            <div className="region-text-side">
              <h1>{currentRegion.name}</h1>
              <p>{currentRegion.history || "Fedezze fel a régió különleges gasztronómiai kínálatát és történelmi emlékeit szakértőink segítségével."}</p>
            </div>
            <div className="region-image-side">
              <img 
                src={`/src/assets/images/${currentRegion.image}`} 
                alt={currentRegion.name} 
                className="hero-img" 
              />
            </div>
          </div>
        </section>

        {/* ALSÓ RÉSZ: Túrák listája (ToursPage dizájnnal) */}
        <section className="region-tours-section">
          <h2 className="section-title-left">Elérhető túrák ezen a területen</h2>
          <div className="tours-grid-3">
            {filteredTours.length > 0 ? (
              filteredTours.map((tour, index) => (
                <div key={tour.id} className="mag-tour-card" onClick={() => navigate(`/tour/${tour.id}`)}>
                  <div className="mag-tour-img">
                    <img src={`/src/assets/images/${tour.kep}`} alt={tour.cim} />
                    {index === 0 && <span className="badge-bestseller">KIEMELT</span>}
                    <button className="heart-btn" onClick={(e) => { e.stopPropagation(); alert('Mentve!'); }}>♡</button>
                  </div>

                  <div className="mag-tour-info">
                    <span className="mag-tour-city">{tour.varos}</span>
                    <h3 className="mag-tour-title">{tour.cim}</h3>
                    <p className="mag-tour-desc">
                      {tour.sub || "Helyi ízek és hagyományok nyomában."}
                    </p>
                    <div className="mag-tour-price">
                      <strong>{tour.ar}</strong> / fő
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-tours">Jelenleg nincs elérhető túra ebben a régióban.</p>
            )}
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default RegionPage;