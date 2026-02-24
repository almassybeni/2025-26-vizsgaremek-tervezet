import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './BookingDetailPage.css';

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBookingDetails();
  }, [id, isAuthenticated]);

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBooking(data);
      } else if (response.status === 404) {
        setError('A foglalás nem található');
      } else {
        setError('Hiba a foglalás betöltésekor');
      }
    } catch (error) {
      setError('Nem sikerült betölteni a foglalást');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    setCancelling(true);
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setCancelSuccess(true);
        setTimeout(() => {
          navigate('/profile?tab=bookings');
        }, 2000);
      } else {
        const data = await response.json();
        alert('Hiba: ' + (data.message || 'Nem sikerült lemondani a foglalást'));
        setShowCancelConfirm(false);
      }
    } catch (error) {
      alert('Nem sikerült csatlakozni a szerverhez');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Függőben',
      'confirmed': 'Megerősítve',
      'cancelled': 'Lemondva',
      'completed': 'Teljesítve'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    const classMap = {
      'pending': 'status-pending',
      'confirmed': 'status-confirmed',
      'cancelled': 'status-cancelled',
      'completed': 'status-completed'
    };
    return classMap[status] || '';
  };

  if (loading) {
    return (
      <div className="booking-detail-page">
        <Header />
        <main className="container">
          <div className="loading-spinner">
            <p>Betöltés...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="booking-detail-page">
        <Header />
        <main className="container">
          <div className="error-container">
            <h2>Hiba történt</h2>
            <p>{error || 'A foglalás nem található'}</p>
            <button onClick={() => navigate('/profile?tab=bookings')} className="back-button">
              Vissza a foglalásaimhoz
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cancelSuccess) {
    return (
      <div className="booking-detail-page">
        <Header />
        <main className="container">
          <div className="success-container">
            <div className="success-icon">✅</div>
            <h2>Sikeres lemondás!</h2>
            <p>A foglalásodat sikeresen lemondtad.</p>
            <p>Átirányítás a foglalásaidhoz...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="booking-detail-page">
      <Header />
      
      <main>
        <div className="booking-detail-hero">
          <div className="container">
            <h1>Foglalás részletei</h1>
            <p className="booking-id">Foglalás azonosító: #{booking.id}</p>
          </div>
        </div>

        <section className="booking-detail-content">
          <div className="container">
            <div className="booking-detail-grid">
              <div className="booking-info-card">
                <div className="card-header">
                  <h2>Foglalás adatok</h2>
                  <span className={`booking-status-badge ${getStatusClass(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </span>
                </div>

                <div className="info-section">
                  <h3>Időpontok</h3>
                  <div className="info-row">
                    <span className="info-label">Foglalás dátuma:</span>
                    <span className="info-value">{formatDate(booking.created_at)}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Túra időpontja:</span>
                    <span className="info-value">{formatDate(booking.tour_date)}</span>
                  </div>
                </div>

                <div className="info-section">
                  <h3>Részletek</h3>
                  <div className="info-row">
                    <span className="info-label">Résztvevők száma:</span>
                    <span className="info-value">{booking.participants_count} fő</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Egységár:</span>
                    <span className="info-value">{Math.round(booking.total_price / booking.participants_count).toLocaleString()} Ft / fő</span>
                  </div>
                  <div className="info-row total">
                    <span className="info-label">Teljes összeg:</span>
                    <span className="info-value price">{booking.total_price.toLocaleString()} Ft</span>
                  </div>
                </div>

                {booking.special_requests && (
                  <div className="info-section">
                    <h3>Speciális kérések</h3>
                    <p className="special-requests">{booking.special_requests}</p>
                  </div>
                )}

                {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                  <div className="cancel-section">
                    {!showCancelConfirm ? (
                      <button 
                        className="cancel-button"
                        onClick={() => setShowCancelConfirm(true)}
                      >
                        Foglalás lemondása
                      </button>
                    ) : (
                      <div className="cancel-confirm">
                        <p>Biztosan le szeretnéd mondani a foglalást?</p>
                        <div className="confirm-buttons">
                          <button 
                            className="confirm-yes"
                            onClick={handleCancelBooking}
                            disabled={cancelling}
                          >
                            {cancelling ? 'Lemondás...' : 'Igen, mondd le'}
                          </button>
                          <button 
                            className="confirm-no"
                            onClick={() => setShowCancelConfirm(false)}
                            disabled={cancelling}
                          >
                            Mégsem
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {booking.status === 'cancelled' && (
                  <div className="cancelled-message">
                    <p>✅ Ez a foglalás le lett mondva.</p>
                  </div>
                )}

                <div className="back-to-bookings">
                  <button 
                    className="back-button"
                    onClick={() => navigate('/profile?tab=bookings')}
                  >
                    ← Vissza a foglalásaimhoz
                  </button>
                </div>
              </div>

              <div className="tour-info-card">
                <h2>Túra adatok</h2>
                
                <div className="tour-image">
                  <img src={`/src/assets/images/${booking.image}`} alt={booking.title} />
                </div>

                <h3 className="tour-title">{booking.title}</h3>
                <p className="tour-location">{booking.city}, {booking.country}</p>

                <div className="tour-details">
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span className="detail-text">{booking.city}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <span className="detail-text">{formatDate(booking.tour_date)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">👥</span>
                    <span className="detail-text">{booking.participants_count} fő</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">⏱️</span>
                    <span className="detail-text">{booking.duration || '6 óra'}</span>
                  </div>
                </div>

                <button 
                  className="view-tour-button"
                  onClick={() => navigate(`/tour/${booking.tour_id}`)}
                >
                  Túra megtekintése
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookingDetailPage;