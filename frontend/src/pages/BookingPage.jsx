import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './BookingPage.css';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
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

    const fetchTour = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/tours/${id}`);
        if (response.ok) {
          const data = await response.json();
          setTour(data);
          setFormData(prev => ({
            ...prev,
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone_number || '',
            participants: location.state?.participants || prev.participants,
            date: location.state?.date || (data.dates?.[0] ? new Date(data.dates[0].start_date).toISOString().split('T')[0] : prev.date)
          }));
        } else {
          navigate('/tours');
        }
      } catch (err) {
        console.error("Hiba a túra betöltésekor:", err);
        navigate('/tours');
      }
    };

    fetchTour();
  }, [id, isAuthenticated, user, navigate, location.state]);

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
      if (!token) {
        setError('Nincs bejelentkezési token. Kérlek, jelentkezz be újra.');
        setTimeout(() => {
          logout();
          navigate('/login', { state: { from: `/booking/${id}` } });
        }, 2000);
        setLoading(false);
        return;
      }

      // Az API-ból érkező ár már szám típusú
      const totalPrice = tour.price * formData.participants;

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
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        setBookingSuccess(true);
        setTimeout(() => {
          navigate('/profile?tab=bookings');
        }, 2000);
      } else {
        let errorMessage = 'Hiba a foglalás során';
        try {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
          
          if (response.status === 401) {
            setError('A token lejárt vagy érvénytelen. Átirányítás a bejelentkezéshez...');
            setTimeout(() => {
              logout();
              navigate('/login', { state: { from: `/booking/${id}` } });
            }, 2000);
            return;
          }
        } catch (e) {
          errorMessage = `Szerver hiba (${response.status}): A kért útvonal nem található vagy a szerver nem küldött választ.`;
        }
        setError(errorMessage);
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
            <p className="tour-title">{tour.title}</p>
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
                        {tour.dates ? tour.dates.map(d => (
                          <option key={d.id} value={new Date(d.start_date).toISOString().split('T')[0]}>
                            {new Date(d.start_date).toLocaleDateString('hu-HU')}
                          </option>
                        )) : (
                          <option value={formData.date}>{formData.date.replace(/-/g, '. ')}</option>
                        )}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="participants">Résztvevők száma</label>
                      <input
                        type="number"
                        id="participants"
                        name="participants"
                        min="1"
                        
                        value={formData.participants}
                        onChange={handleChange}
                        required
                        max={tour.max_participants || 12}
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
                    <img src={`/src/assets/images/${tour.image}`} alt={tour.title} />
                  </div>
                  
                  <h3>{tour.title}</h3>
                  <p className="summary-location">{tour.city}{tour.country ? `, ${tour.country}` : ''}</p>
                  
                  <div className="summary-details">
                    <div className="summary-row">
                      <span>Időtartam:</span>
                      <span>{tour.duration} óra</span>
                    </div>
                    <div className="summary-row">
                      <span>Választott időpont:</span>
                      <span>{formData.date ? formData.date.replace(/-/g, '. ') : 'Nincs kiválasztva'}</span>
                    </div>
                    <div className="summary-row">
                      <span>Résztvevők:</span>
                      <span>{formData.participants} fő</span>
                    </div>
                    <div className="summary-row total">
                      <span>Teljes összeg:</span>
                      <span className="total-price">
                        {(tour.price * formData.participants).toLocaleString()} Ft
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