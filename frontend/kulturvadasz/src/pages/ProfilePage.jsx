import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, logout, isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: ''
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone_number: user.phone_number || ''
      });
    }

    fetchUserBookings();
  }, [isAuthenticated, navigate, user]);

  const fetchUserBookings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bookings/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Hiba a foglalások betöltésekor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess(false);

    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          phone_number: formData.phone_number
        })
      });

      if (response.ok) {
        setUpdateSuccess(true);
        setEditing(false);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const data = await response.json();
        setUpdateError(data.message || 'Hiba a frissítés során');
      }
    } catch (error) {
      setUpdateError('Nem sikerült csatlakozni a szerverhez');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      <Header />
      
      <main className="profile-main">
        <div className="container">
          <div className="profile-header">
            <div className="profile-title">
              <h1>Profilom</h1>
              <p>Üdv újra, <strong>{user.name}</strong>!</p>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Kijelentkezés
            </button>
          </div>

          <div className="profile-tabs">
            <button 
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('profile');
                navigate('/profile');
              }}
            >
              <span className="tab-icon">👤</span>
              Profil adatok
            </button>
            <button 
              className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('bookings');
                navigate('/profile?tab=bookings');
              }}
            >
              <span className="tab-icon">📅</span>
              Foglalásaim ({bookings.length})
            </button>
            {user.role === 'admin' && (
              <button 
                className={`tab-button ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('admin');
                  navigate('/profile?tab=admin');
                }}
              >
                <span className="tab-icon">⚙️</span>
                Admin felület
              </button>
            )}
          </div>

          <div className="profile-content">
            {activeTab === 'profile' && (
              <div className="profile-info-section">
                <div className="section-header">
                  <h2>Személyes adatok</h2>
                  {!editing && (
                    <button 
                      className="edit-button"
                      onClick={() => setEditing(true)}
                    >
                      ✏️ Szerkesztés
                    </button>
                  )}
                </div>

                {updateSuccess && (
                  <div className="success-message">
                    ✅ Adatok sikeresen frissítve! Oldal frissítése...
                  </div>
                )}

                {updateError && (
                  <div className="error-message">
                    ❌ {updateError}
                  </div>
                )}

                {editing ? (
                  <form onSubmit={handleUpdateProfile} className="profile-edit-form">
                    <div className="form-group">
                      <label htmlFor="name">Név</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="disabled-input"
                      />
                      <small className="field-note">Az email cím nem módosítható</small>
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone_number">Telefonszám</label>
                      <input
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        placeholder="+36 30 123 4567"
                      />
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="save-button">
                        Mentés
                      </button>
                      <button 
                        type="button" 
                        className="cancel-button"
                        onClick={() => {
                          setEditing(false);
                          setFormData({
                            name: user.name || '',
                            email: user.email || '',
                            phone_number: user.phone_number || ''
                          });
                        }}
                      >
                        Mégse
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-info-grid">
                    <div className="info-card">
                      <div className="info-icon">👤</div>
                      <div className="info-content">
                        <span className="info-label">Név</span>
                        <span className="info-value">{user.name}</span>
                      </div>
                    </div>

                    <div className="info-card">
                      <div className="info-icon">📧</div>
                      <div className="info-content">
                        <span className="info-label">Email</span>
                        <span className="info-value">{user.email}</span>
                      </div>
                    </div>

                    <div className="info-card">
                      <div className="info-icon">📞</div>
                      <div className="info-content">
                        <span className="info-label">Telefonszám</span>
                        <span className="info-value">{user.phone_number || 'Nincs megadva'}</span>
                      </div>
                    </div>

                    <div className="info-card">
                      <div className="info-icon">📅</div>
                      <div className="info-content">
                        <span className="info-label">Regisztráció</span>
                        <span className="info-value">{formatDate(user.created_at)}</span>
                      </div>
                    </div>

                    <div className="info-card">
                      <div className="info-icon">🕐</div>
                      <div className="info-content">
                        <span className="info-label">Utolsó bejelentkezés</span>
                        <span className="info-value">
                          {user.last_login ? formatDate(user.last_login) : 'Még nem jelentkezett be'}
                        </span>
                      </div>
                    </div>

                    <div className="info-card">
                      <div className="info-icon">🔑</div>
                      <div className="info-content">
                        <span className="info-label">Jogosultság</span>
                        <span className={`role-badge ${user.role}`}>
                          {user.role === 'admin' ? 'Adminisztrátor' : 'Tag'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="profile-bookings-section">
                <h2>Foglalásaim</h2>
                
                {loading ? (
                  <div className="loading-spinner">
                    <p>Foglalások betöltése...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="no-bookings">
                    <div className="empty-state-icon">📅</div>
                    <h3>Még nincs egyetlen foglalásod sem</h3>
                    <p>Fedezd fel gasztrotúráinkat és foglalj még ma!</p>
                    <button 
                      className="browse-tours-button"
                      onClick={() => navigate('/tours')}
                    >
                      Túrák böngészése
                    </button>
                  </div>
                ) : (
                  <div className="bookings-grid">
                    {bookings.map(booking => (
                      <div 
                        key={booking.id} 
                        className="booking-card"
                        onClick={() => navigate(`/booking/detail/${booking.id}`)}
                      >
                        <div className="booking-image">
                          <img src={`/src/assets/images/${booking.image}`} alt={booking.title} />
                          <span className={`booking-status ${getStatusClass(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
                        </div>
                        <div className="booking-details">
                          <h3 className="booking-title">{booking.title}</h3>
                          <p className="booking-location">{booking.city}, {booking.country}</p>
                          
                          <div className="booking-meta">
                            <div className="meta-item">
                              <span className="meta-icon">📅</span>
                              <span className="meta-text">{formatDate(booking.tour_date)}</span>
                            </div>
                            <div className="meta-item">
                              <span className="meta-icon">👥</span>
                              <span className="meta-text">{booking.participants_count} fő</span>
                            </div>
                            <div className="meta-item">
                              <span className="meta-icon">💰</span>
                              <span className="meta-text price">{booking.total_price.toLocaleString()} Ft</span>
                            </div>
                          </div>

                          <div className="booking-footer">
                            <span className="booking-date">
                              Foglalva: {formatDate(booking.created_at)}
                            </span>
                            <button className="view-details-button">
                              Részletek
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'admin' && user.role === 'admin' && (
              <div className="profile-admin-section">
                <h2>Admin felület</h2>
                <div className="admin-menu">
                  <div className="admin-card" onClick={() => navigate('/admin/tours')}>
                    <div className="admin-icon">🗺️</div>
                    <h3>Túrák kezelése</h3>
                    <p>Új túrák hozzáadása, meglévők szerkesztése</p>
                  </div>
                  
                  <div className="admin-card" onClick={() => navigate('/admin/users')}>
                    <div className="admin-icon">👥</div>
                    <h3>Felhasználók kezelése</h3>
                    <p>Felhasználók listázása, jogosultságok kezelése</p>
                  </div>
                  
                  <div className="admin-card" onClick={() => navigate('/admin/bookings')}>
                    <div className="admin-icon">📋</div>
                    <h3>Összes foglalás</h3>
                    <p>Foglalások áttekintése, státusz módosítása</p>
                  </div>
                  
                  <div className="admin-card" onClick={() => navigate('/admin/messages')}>
                    <div className="admin-icon">✉️</div>
                    <h3>Üzenetek</h3>
                    <p>Felhasználói üzenetek kezelése</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;