import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTours: 0,
    totalBookings: 0,
    totalUsers: 0,
    pendingBookings: 0,
    revenue: 0,
    popularTours: []
  });
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Itt kellene lekérni a valós adatokat a backendről
      // Most szimuláljuk
      setTimeout(() => {
        setStats({
          totalTours: 15,
          totalBookings: 245,
          totalUsers: 180,
          pendingBookings: 12,
          revenue: 3245000,
          popularTours: [
            { id: 1, name: 'Budapest - Nagypiac', bookings: 45 },
            { id: 2, name: 'Eger - Borkultúra', bookings: 38 },
            { id: 3, name: 'Szeged - Halászlé', bookings: 32 },
            { id: 4, name: 'Tokaj - Aszú', bookings: 28 }
          ]
        });
        setRecentBookings([
          { id: 1, user: 'Kovács János', tour: 'Budapest - Nagypiac', date: '2024-03-15', status: 'pending' },
          { id: 2, user: 'Nagy Anna', tour: 'Eger - Borkultúra', date: '2024-03-14', status: 'confirmed' },
          { id: 3, user: 'Szabó Péter', tour: 'Szeged - Halászlé', date: '2024-03-13', status: 'confirmed' },
          { id: 4, user: 'Tóth Eszter', tour: 'Tokaj - Aszú', date: '2024-03-12', status: 'completed' },
          { id: 5, user: 'Varga Gábor', tour: 'Pécs - Borok', date: '2024-03-11', status: 'pending' }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Hiba az adatok lekérésekor:', error);
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const statusMap = {
      'pending': 'status-pending',
      'confirmed': 'status-confirmed',
      'cancelled': 'status-cancelled',
      'completed': 'status-completed'
    };
    return statusMap[status] || '';
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

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-spinner">Adatok betöltése...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Vezérlőpult</h2>
        <div className="date-display">
          {new Date().toLocaleDateString('hu-HU', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Statisztika kártyák */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🗺️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalTours}</div>
            <div className="stat-label">Aktív túrák</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalBookings}</div>
            <div className="stat-label">Összes foglalás</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Regisztrált felhasználó</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{stats.pendingBookings}</div>
            <div className="stat-label">Függőben lévő</div>
          </div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">{stats.revenue.toLocaleString()} Ft</div>
            <div className="stat-label">Bevétel (összes)</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Népszerű túrák */}
        <div className="dashboard-card">
          <h3>Legnépszerűbb túrák</h3>
          <div className="popular-tours-list">
            {stats.popularTours.map(tour => (
              <div key={tour.id} className="popular-tour-item">
                <div className="tour-info">
                  <span className="tour-name">{tour.name}</span>
                  <span className="tour-bookings">{tour.bookings} foglalás</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(tour.bookings / 50) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legfrissebb foglalások */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Legfrissebb foglalások</h3>
            <button 
              className="view-all-btn"
              onClick={() => navigate('/admin/bookings')}
            >
              Összes megtekintése →
            </button>
          </div>
          <div className="recent-bookings-list">
            {recentBookings.map(booking => (
              <div key={booking.id} className="recent-booking-item">
                <div className="booking-info">
                  <div className="booking-user">{booking.user}</div>
                  <div className="booking-tour">{booking.tour}</div>
                  <div className="booking-date">{booking.date}</div>
                </div>
                <span className={`booking-status ${getStatusClass(booking.status)}`}>
                  {getStatusText(booking.status)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Gyors műveletek */}
        <div className="dashboard-card">
          <h3>Gyors műveletek</h3>
          <div className="quick-actions">
            <button 
              className="action-btn"
              onClick={() => navigate('/admin/tours/new')}
            >
              <span className="action-icon">➕</span>
              Új túra hozzáadása
            </button>
            <button 
              className="action-btn"
              onClick={() => navigate('/admin/bookings/pending')}
            >
              <span className="action-icon">⏳</span>
              Függőben lévő foglalások
            </button>
            <button 
              className="action-btn"
              onClick={() => navigate('/admin/messages')}
            >
              <span className="action-icon">✉️</span>
              Olvasatlan üzenetek (3)
            </button>
            <button 
              className="action-btn"
              onClick={() => navigate('/admin/users')}
            >
              <span className="action-icon">👤</span>
              Új felhasználó hozzáadása
            </button>
          </div>
        </div>

        {/* Rendszer információk */}
        <div className="dashboard-card">
          <h3>Rendszer információk</h3>
          <div className="system-info">
            <div className="info-row">
              <span className="info-label">Verzió:</span>
              <span className="info-value">1.0.0</span>
            </div>
            <div className="info-row">
              <span className="info-label">Utolsó frissítés:</span>
              <span className="info-value">2024.03.15.</span>
            </div>
            <div className="info-row">
              <span className="info-label">Adatbázis:</span>
              <span className="info-value">MySQL - kulturvadasz</span>
            </div>
            <div className="info-row">
              <span className="info-label">Szerver idő:</span>
              <span className="info-value">{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Bejelentkezve:</span>
              <span className="info-value">Admin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;