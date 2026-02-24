import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toursData } from '../data/toursData';
import './BookingPage.css';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, token, logout } = useAuth();
  
  const [tour, setTour] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    participants: 1,
    date: '2024-06-15',
    special_requests: ''
  });
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/booking/${id}` } });
      return;
    }

    const foundTour = toursData.find(t => t.id === parseInt(id));
    if (foundTour) {
      setTour(foundTour);
      setFormData(prev => ({
        ...prev,
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone_number || ''
      }));
    } else {
      navigate('/tours');
    }
  }, [id, isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const currentToken = localStorage.getItem('token');
      
      if (!currentToken) {
        setError('Nincs bejelentkezési token. Kérlek, jelentkezz be újra.');
        setTimeout(() => {
          logout();
          navigate('/login', { state: { from: `/booking/${id}` } });
        }, 2000);
        setLoading(false);
        return;
      }

      const price = parseInt(tour.ar.replace(' Ft', ''));
      const totalPrice = price * formData.participants;

      const bookingData = {
        tour_id: tour.id,
        tour_date: formData.date,
        participants_count: formData.participants,
        special_requests: formData.special_requests,
        total_price: totalPrice
      };

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        setBookingSuccess(true);
        setTimeout(() => {
          navigate('/profile?tab=bookings');
        }, 2000);
      } else {
        const data = await response.json();
        
        if (response.status === 401) {
          setError('A token lejárt vagy érvénytelen. Átirányítás a bejelentkezéshez...');
          setTimeout(() => {
            logout();
            navigate('/login', { state: { from: `/booking/${id}` } });
          }, 2000);
        } else {
          setError(data.message || 'Hiba a foglalás során');
        }
      }
    } catch (error) {
      setError('Nem sikerült csatlakozni a szerverhez');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginAgain = () => {
    logout();
    navigate('/login', { state: { from: `/booking/${id}` } });
  };

  if (!tour) {
    return (
      <div className="booking-page">
        <Header />
        <main className="container">
          <div className="loading">Betöltés...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="booking-page">
        <Header />
        <main className="container">
          <div className="booking-success">
            <h2>Sikeres foglalás!</h2>
            <p>Köszönjük, hogy minket választottál!</p>
            <p>Átirányítás a foglalásaidhoz...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="booking-page">
      <Header />
      
      <main>
        <div className="booking-hero">
          <div className="container">
            <h1>Foglalás</h1>
            <p className="tour-title">{tour.cim}</p>
          </div>
        </div>

        <section className="booking-content">
          <div className="container">
            <div className="booking-grid">
              <div className="booking-form-container">
                <h2>Foglalási adatok</h2>
                
                {error && (
                  <div className="error-message">
                    ❌ {error}
                    {error.includes('token') && (
                      <button onClick={handleLoginAgain} className="retry-login-btn">
                        Újrabejelentkezés
                      </button>
                    )}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="booking-form">
                  <div className="form-group">
                    <label htmlFor="name">Teljes név</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email cím</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Telefonszám</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="date">Időpont</label>
                      <select
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <option value="2024-06-15">2024. június 15.</option>
                        <option value="2024-06-22">2024. június 22.</option>
                        <option value="2024-06-29">2024. június 29.</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="participants">Résztvevők száma</label>
                      <input
                        type="number"
                        id="participants"
                        name="participants"
                        min="1"
                        max="12"
                        value={formData.participants}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="special_requests">Speciális kérések (opcionális)</label>
                    <textarea
                      id="special_requests"
                      name="special_requests"
                      rows="4"
                      value={formData.special_requests}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Pl. ételallergia, diéta, stb."
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="booking-submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Feldolgozás...' : 'Foglalás megerősítése'}
                  </button>
                </form>
              </div>

              <div className="booking-summary">
                <h2>Foglalás összegzése</h2>
                
                <div className="summary-card">
                  <div className="summary-image">
                    <img src={`/src/assets/images/${tour.kep}`} alt={tour.cim} />
                  </div>
                  
                  <h3>{tour.cim}</h3>
                  <p className="summary-location">{tour.varos}, {tour.orszag}</p>
                  
                  <div className="summary-details">
                    <div className="summary-row">
                      <span>Időtartam:</span>
                      <span>{tour.idotartam}</span>
                    </div>
                    <div className="summary-row">
                      <span>Választott időpont:</span>
                      <span>{formData.date.replace(/-/g, '. ')}</span>
                    </div>
                    <div className="summary-row">
                      <span>Résztvevők:</span>
                      <span>{formData.participants} fő</span>
                    </div>
                    <div className="summary-row total">
                      <span>Teljes összeg:</span>
                      <span className="total-price">
                        {(parseInt(tour.ar.replace(' Ft', '')) * formData.participants).toLocaleString()} Ft
                      </span>
                    </div>
                  </div>
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

export default BookingPage;