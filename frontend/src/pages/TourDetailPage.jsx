import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import './TourDetailPage.css';

const TourDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [participants, setParticipants] = useState(2);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tours/${id}`);
        setTour(res.data);
        // Alapértelmezett dátum beállítása, ha van elérhető időpont
        if (res.data.dates && res.data.dates.length > 0) {
          setSelectedDate(new Date(res.data.dates[0].start_date).toISOString().split('T')[0]);
        }
      } catch (err) {
        setError("A túra részleteit nem sikerült betölteni.");
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  const handleBookingRedirect = () => {
    if (!selectedDate) {
      alert('Kérlek, válassz egy időpontot!');
      return;
    }
    // Átirányítás a foglalási oldalra a kiválasztott adatokkal
    navigate(`/booking/${id}`, { 
      state: { 
        participants: parseInt(participants), 
        date: selectedDate 
      } 
    });
  };

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
            src={tour.image && (tour.image.startsWith('http') || tour.image.startsWith('data:')) ? tour.image : `/src/assets/images/${tour.image}`} 
            alt={tour.title} 
          />
        </div>
      </div>

      <div className="tour-content-container">
        {/* BAL OLDAL: Tartalom */}
        <div className="tour-main-info">
          <h1 className="tour-main-title">{tour.title}</h1>
          
          <section className="info-section">
            <h2 className="section-label">RÓLUNK</h2>
            <p className="description-text">{tour.description}</p>
          </section>

          <section className="info-section">
            <h2 className="section-label">RÉSZLETEK</h2>
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
            <h2 className="section-label">ÉTREND</h2>
            <p className="description-text">
              A túra során figyelembe tudunk venni vegetáriánus igényeket. 
              Kérjük, az ételallergiákat a foglalás során jelezze!
            </p>
          </section>
        </div>

        {/* JOBB OLDAL: Sticky foglalási kártya */}
        <aside className="tour-booking-sidebar">
          <div className="booking-card">
            <h3>Foglalja le a helyét</h3>
            <div className="booking-form">
              <div className="input-group">
                <label>Vendégek száma</label>
                <input 
                  type="number" 
                  min="1" 
                  max={tour.max_participants} 
                  value={participants} 
                  onChange={(e) => setParticipants(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Válassz dátumot</label>
                <select 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  <option value="">Válassz időpontot...</option>
                  {tour.dates && tour.dates.map(d => (
                    <option key={d.id} value={new Date(d.start_date).toISOString().split('T')[0]}>
                      {new Date(d.start_date).toLocaleDateString('hu-HU')}
                    </option>
                  ))}
                </select>
              </div>
              <button 
                className="reserve-now-btn"
                onClick={handleBookingRedirect}
              >
                FOGLALÁS MOST
              </button>
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