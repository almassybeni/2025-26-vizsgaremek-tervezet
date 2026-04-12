import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import './TourDetailPage.css';

const TourDetailPage = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tours/${id}`);
        setTour(res.data);
      } catch (err) {
        setError("A túra részleteit nem sikerült betölteni.");
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  if (loading) {
    return (
      <div className="tour-detail-wrapper">
        <Header />
        <div className="loading-container">Betöltés...</div>
        <Footer />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="tour-detail-wrapper">
        <Header />
        <div className="error-container">
          <h2>{error || "Túra nem található"}</h2>
          <BackButton to="/tours" label="Vissza a túrákhoz" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="tour-detail-wrapper">
      <Header />
      
      <div className="tour-hero-container">
        {/* Hero kép szekció */}
        <div className="tour-hero">
          <div className="hero-overlay">
             <BackButton />
          </div>
          <img 
            src={tour.image && (tour.image.startsWith('http') || tour.image.startsWith('data:')) ? tour.image : `/src/assets/images/${tour.image || 'placeholder.jpg'}`} 
            alt={tour.title} 
          />
        </div>
      </div>

      <div className="tour-content-container">
        {/* BAL OLDAL: Tartalom */}
        <div className="tour-main-info">
          <h1 className="tour-main-title">{tour.title}</h1>
          
          <section className="info-section">
            <h2 className="section-label">ABOUT</h2>
            <p className="description-text">{tour.description}</p>
          </section>

          <section className="info-section">
            <h2 className="section-label">DETAILS</h2>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-icon">👥</span>
                <div><strong>Csoportméret:</strong> {tour.max_participants} főig</div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">⏳</span>
                <div><strong>Időtartam:</strong> {tour.duration} óra</div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <div><strong>Helyszín:</strong> {tour.city}</div>
              </div>
              <div className="detail-item">
                <span className="detail-icon">💰</span>
                <div><strong>Ár:</strong> {tour.price.toLocaleString()} Ft / fő</div>
              </div>
            </div>
          </section>

          <section className="info-section">
            <h2 className="section-label">DIETARY</h2>
            <p className="description-text">
              A túra során figyelembe tudunk venni vegetáriánus igényeket. 
              Kérjük, az ételallergiákat a foglalás során jelezze!
            </p>
          </section>
        </div>

        {/* JOBB OLDAL: Sticky foglalási kártya */}
        <aside className="tour-booking-sidebar">
          <div className="booking-card">
            <h3>Reserve Your Spot</h3>
            <div className="booking-form">
              <div className="input-group">
                <label>Vendégek száma</label>
                <input type="number" min="1" max={tour.max_participants} defaultValue="2" />
              </div>
              <div className="input-group">
                <label>Válassz dátumot</label>
                <select>
                  <option value="">Válassz időpontot...</option>
                  {tour.dates && tour.dates.map(d => (
                    <option key={d.id} value={d.id}>
                      {new Date(d.start_date).toLocaleDateString('hu-HU')}
                    </option>
                  ))}
                </select>
              </div>
              <button className="reserve-now-btn">RESERVE NOW</button>
              <p className="booking-disclaimer">
                Az ár tartalmazza az összes kóstolót és italt a túra során.
              </p>
            </div>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
};

export default TourDetailPage;