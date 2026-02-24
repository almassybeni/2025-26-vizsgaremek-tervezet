import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { toursData } from '../data/toursData';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const featuredTours = toursData.slice(0, 6);

  return (
    <div className="homepage">
      <Header />
      
      <main>
        <Hero />

        <section className="featured-section">
          <div className="container">
            <div className="featured-content">
              <h2>Ahogy bemutatták:</h2>
              <div className="featured-logos">
                <span>Magyar Konyha</span>
                <span>Ízőrzők</span>
                <span>Gasztro Magazin</span>
                <span>Turizmus Online</span>
              </div>
            </div>
          </div>
        </section>

        <section id="tours" className="tours-section">
          <div className="container">
            <div className="section-header">
              <h2>Kiemelt Gasztrotúráink</h2>
              <p>Fedezze fel a Kárpát-medence autentikus ízeit</p>
            </div>
            
            <div className="tours-grid">
              {featuredTours.map(tour => (
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
                    <p className="tour-description">{tour.leiras.substring(0, 100)}...</p>
                    <div className="tour-footer">
                      <span className="tour-price">{tour.ar}</span>
                      <button 
                        className="btn-primary" 
                        onClick={() => navigate(`/tour/${tour.id}`)}
                      >
                        Túra részletei
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center" style={{ marginTop: '3rem' }}>
              <button 
                className="btn-primary btn-large" 
                onClick={() => navigate('/tours')}
              >
                Összes túra megtekintése
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;