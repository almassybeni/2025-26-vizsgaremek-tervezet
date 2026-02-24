import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toursData } from '../data/toursData';
import './TourDetailPage.css';

const TourDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const tour = toursData.find(t => t.id === parseInt(id));

  const handleBooking = () => {
    if (isAuthenticated) {
      navigate(`/booking/${id}`);
    } else {
      navigate('/login', { state: { from: `/tour/${id}` } });
    }
  };

  if (!tour) {
    return (
      <div className="tour-detail-page">
        <Header />
        <main className="container">
          <div className="not-found">
            <h2>A keresett túra nem található</h2>
            <button onClick={() => navigate('/tours')}>Vissza a túrákhoz</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="tour-detail-page">
      <Header />
      
      <main>
        <div className="tour-detail-hero">
          <div className="container">
            <h1>{tour.cim}</h1>
            <div className="tour-meta">
              <span className="tour-location">{tour.varos}, {tour.orszag}</span>
              <span className="tour-duration">{tour.idotartam}</span>
              <span className="tour-price-large">{tour.ar}</span>
            </div>
          </div>
        </div>

        <section className="tour-detail-content">
          <div className="container">
            <div className="tour-detail-grid">
              <div className="tour-detail-left">
                <div className="tour-detail-image">
                  <img src={`/src/assets/images/${tour.kep}`} alt={tour.cim} />
                </div>
                
                <div className="tour-description-full">
                  <h2>Részletes leírás</h2>
                  <p>{tour.leiras}</p>
                </div>

                <div className="tour-highlights">
                  <h3>Programterv</h3>
                  <ul>
                    <li>✅ Helyi piac látogatás</li>
                    <li>✅ Autentikus ételkóstolók</li>
                    <li>✅ Helyi termelők megismerése</li>
                    <li>✅ Borkóstoló pincelátogatással</li>
                    <li>✅ Magyar gasztronómiai bemutató</li>
                  </ul>
                </div>
              </div>

              <div className="tour-detail-right">
                <div className="tour-info-box">
                  <h3>Információk</h3>
                  
                  <div className="info-item">
                    <span className="info-label">Időtartam:</span>
                    <span className="info-value">{tour.idotartam}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Helyszín:</span>
                    <span className="info-value">{tour.varos}, {tour.orszag}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Ár:</span>
                    <span className="info-value price">{tour.ar} / fő</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Max. létszám:</span>
                    <span className="info-value">12 fő</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Következő időpont:</span>
                    <span className="info-value">2024. június 15.</span>
                  </div>

                  <div className="signup-section">
                    <button 
                      className="btn-signup"
                      onClick={handleBooking}
                    >
                      {isAuthenticated ? 'Foglalás' : 'Jelentkezés / Foglalás'}
                    </button>
                  </div>
                </div>

                <div className="tour-info-box">
                  <h3>Miért érdemes velünk jönnöd?</h3>
                  <ul className="benefits-list">
                    <li>🔥 Autentikus helyi élmények</li>
                    <li>🔥 Kiscsoportos túrák</li>
                    <li>🔥 Helyi idegenvezetők</li>
                    <li>🔥 Minden kóstoló benne van az árban</li>
                    <li>🔥 Rugalmas lemondási feltételek</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default TourDetailPage;