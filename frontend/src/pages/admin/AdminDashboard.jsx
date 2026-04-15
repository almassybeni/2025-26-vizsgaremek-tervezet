import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTours: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Megjegyzés: Ehhez a backend-en szükség lesz egy /api/admin/stats végpontra
        const res = await axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (error) {
        console.error('Hiba a statisztikák betöltésekor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) return <div className="loading-spinner">Statisztikák betöltése...</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Vezérlőpult</h2>
        <div className="date-display">{new Date().toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Felhasználók</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🗺️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalTours}</div>
            <div className="stat-label">Aktív Túrák</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalBookings}</div>
            <div className="stat-label">Foglalások</div>
          </div>
        </div>
        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalRevenue?.toLocaleString()} Ft</div>
            <div className="stat-label">Összes bevétel</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Legutóbbi Foglalások</h3>
          <div className="recent-bookings-list">
            {stats.recentBookings.length > 0 ? (
              stats.recentBookings.map(booking => (
                <div key={booking.id} className="recent-booking-item">
                  <div className="booking-info">
                    <div className="booking-user">{booking.user_name}</div>
                    <div className="booking-tour">{booking.tour_title}</div>
                    <div className="booking-date">{new Date(booking.created_at).toLocaleDateString('hu-HU')}</div>
                  </div>
                  <div className={`booking-status status-${booking.status}`}>
                    {booking.status === 'confirmed' ? 'Visszaigazolt' : 'Függőben'}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">Nincs friss foglalás.</p>
            )}
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default AdminDashboard;