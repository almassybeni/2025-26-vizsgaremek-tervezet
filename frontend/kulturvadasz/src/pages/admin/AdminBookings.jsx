import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import BackButton from '../../components/BackButton';
import './AdminBookings.css';

const AdminBookings = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // Itt kellene lekérni a valós adatokat a backendről
      // Most szimuláljuk
      setTimeout(() => {
        setBookings([
          { 
            id: 1, 
            user: 'Kovács János', 
            userEmail: 'kovacs.janos@email.hu',
            tour: 'Budapest - Nagypiac & Belvárosi Ízek',
            tourId: 1,
            date: '2024-03-15', 
            participants: 2,
            totalPrice: 37980,
            status: 'pending',
            created_at: '2024-03-10',
            special_requests: 'Vegetáriánus étkezés'
          },
          { 
            id: 2, 
            user: 'Nagy Anna', 
            userEmail: 'nagy.anna@email.hu',
            tour: 'Eger - Egri Borkultúra',
            tourId: 2,
            date: '2024-03-14', 
            participants: 1,
            totalPrice: 24990,
            status: 'confirmed',
            created_at: '2024-03-09',
            special_requests: ''
          },
          { 
            id: 3, 
            user: 'Szabó Péter', 
            userEmail: 'szabo.peter@email.hu',
            tour: 'Szeged - Halászlé',
            tourId: 3,
            date: '2024-03-13', 
            participants: 4,
            totalPrice: 63960,
            status: 'confirmed',
            created_at: '2024-03-08',
            special_requests: 'Gluténérzékeny'
          },
          { 
            id: 4, 
            user: 'Tóth Eszter', 
            userEmail: 'toth.eszter@email.hu',
            tour: 'Tokaj - Tokaji Aszú',
            tourId: 8,
            date: '2024-03-12', 
            participants: 2,
            totalPrice: 57980,
            status: 'completed',
            created_at: '2024-03-01',
            special_requests: ''
          },
          { 
            id: 5, 
            user: 'Varga Gábor', 
            userEmail: 'varga.gabor@email.hu',
            tour: 'Pécs - Pécsi Borok',
            tourId: 4,
            date: '2024-03-11', 
            participants: 3,
            totalPrice: 65970,
            status: 'pending',
            created_at: '2024-03-05',
            special_requests: 'Későbbi időpont'
          },
          { 
            id: 6, 
            user: 'Kiss Mária', 
            userEmail: 'kiss.maria@email.hu',
            tour: 'Debrecen - Hortobágyi Pásztorételek',
            tourId: 5,
            date: '2024-03-10', 
            participants: 2,
            totalPrice: 45980,
            status: 'cancelled',
            created_at: '2024-03-02',
            special_requests: ''
          },
          { 
            id: 7, 
            user: 'Molnár Dávid', 
            userEmail: 'molnar.david@email.hu',
            tour: 'Szentendre - Szerb Hatások',
            tourId: 6,
            date: '2024-03-09', 
            participants: 1,
            totalPrice: 17990,
            status: 'confirmed',
            created_at: '2024-03-01',
            special_requests: ''
          },
          { 
            id: 8, 
            user: 'Farkas Éva', 
            userEmail: 'farkas.eva@email.hu',
            tour: 'Tihany - Balatoni Halételek',
            tourId: 7,
            date: '2024-03-08', 
            participants: 2,
            totalPrice: 47980,
            status: 'pending',
            created_at: '2024-02-28',
            special_requests: 'Halallergia, de halászlé kell'
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Hiba a foglalások betöltésekor:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (window.confirm(`Biztosan módosítod a foglalás státuszát "${newStatus}"-re?`)) {
      // Itt kellene backend hívás
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, status: newStatus } : booking
      ));
    }
  };

  const handleDeleteBooking = (id) => {
    if (window.confirm('Biztosan törölni szeretnéd ezt a foglalást?')) {
      setBookings(bookings.filter(booking => booking.id !== id));
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.tour.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    const matchesDate = !dateFilter || booking.date === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('hu-HU');
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString() + ' Ft';
  };

  if (loading) {
    return (
      <div className="admin-bookings">
        <BackButton to="/admin" label="Vissza a vezérlőpultra" />
        <div className="loading-spinner">Foglalások betöltése...</div>
      </div>
    );
  }

  return (
    <div className="admin-bookings">
      <BackButton to="/admin" label="Vissza a vezérlőpultra" />
      
      <div className="admin-bookings-header">
        <h2>Foglalások kezelése</h2>
        <div className="booking-stats">
          <div className="stat-badge">
            <span className="stat-label">Összes:</span>
            <span className="stat-value">{bookings.length}</span>
          </div>
          <div className="stat-badge pending">
            <span className="stat-label">Függőben:</span>
            <span className="stat-value">{bookings.filter(b => b.status === 'pending').length}</span>
          </div>
          <div className="stat-badge confirmed">
            <span className="stat-label">Megerősítve:</span>
            <span className="stat-value">{bookings.filter(b => b.status === 'confirmed').length}</span>
          </div>
        </div>
      </div>

      <div className="bookings-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Keresés név, email vagy túra alapján..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">Minden státusz</option>
          <option value="pending">Függőben</option>
          <option value="confirmed">Megerősítve</option>
          <option value="completed">Teljesítve</option>
          <option value="cancelled">Lemondva</option>
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="date-input"
        />
      </div>

      <div className="bookings-table-container">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Felhasználó</th>
              <th>Túra</th>
              <th>Időpont</th>
              <th>Foglalva</th>
              <th>Létszám</th>
              <th>Összeg</th>
              <th>Státusz</th>
              <th>Speciális</th>
              <th>Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(booking => (
              <tr key={booking.id}>
                <td>#{booking.id}</td>
                <td>
                  <div className="user-info">
                    <div className="user-name">{booking.user}</div>
                    <div className="user-email">{booking.userEmail}</div>
                  </div>
                </td>
                <td className="tour-cell">
                  <div className="tour-name">{booking.tour}</div>
                </td>
                <td>{formatDate(booking.date)}</td>
                <td>{formatDate(booking.created_at)}</td>
                <td className="text-center">{booking.participants} fő</td>
                <td className="text-right price">{formatCurrency(booking.totalPrice)}</td>
                <td>
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    className={`status-select ${getStatusClass(booking.status)}`}
                  >
                    <option value="pending">Függőben</option>
                    <option value="confirmed">Megerősítve</option>
                    <option value="completed">Teljesítve</option>
                    <option value="cancelled">Lemondva</option>
                  </select>
                </td>
                <td>
                  {booking.special_requests ? (
                    <span className="special-requests" title={booking.special_requests}>
                      ⚠️
                    </span>
                  ) : (
                    <span className="no-requests">-</span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn view"
                      onClick={() => window.open(`/booking/detail/${booking.id}`, '_blank')}
                      title="Megtekintés"
                    >
                      👁️
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteBooking(booking.id)}
                      title="Törlés"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bookings-summary">
        <h3>Összesítés</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Teljes bevétel:</span>
            <span className="summary-value">
              {formatCurrency(bookings.reduce((sum, b) => sum + b.totalPrice, 0))}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Átlagos foglalási érték:</span>
            <span className="summary-value">
              {formatCurrency(Math.round(bookings.reduce((sum, b) => sum + b.totalPrice, 0) / bookings.length))}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Összes résztvevő:</span>
            <span className="summary-value">
              {bookings.reduce((sum, b) => sum + b.participants, 0)} fő
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;