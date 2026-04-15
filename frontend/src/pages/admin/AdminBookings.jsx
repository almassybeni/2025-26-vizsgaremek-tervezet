import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import BackButton from '../../components/BackButton';
import './AdminBookings.css';

const AdminBookings = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (error) {
      console.error('Hiba a foglalások betöltésekor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (error) {
      alert('Hiba a státusz frissítésekor.');
    }
  };

  if (loading) return <div className="loading-spinner">Foglalások betöltése...</div>;

  return (
    <div className="admin-bookings">
      <BackButton to="/admin" label="Vissza a vezérlőpultra" />
      
      <div className="admin-bookings-header">
        <h2>Foglalások kezelése</h2>
      </div>

      <div className="bookings-table-container">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Felhasználó</th>
              <th>Túra</th>
              <th>Dátum</th>
              <th>Fő</th>
              <th>Összeg</th>
              <th>Státusz</th>
              <th>Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>#{booking.id}</td>
                <td>
                  <div className="user-info">
                    <span className="user-name">{booking.user_name}</span>
                    <span className="user-email">{booking.user_email}</span>
                  </div>
                </td>
                <td className="tour-name">{booking.tour_title}</td>
                <td>{new Date(booking.tour_date).toLocaleDateString('hu-HU')}</td>
                <td className="text-center">{booking.participants_count}</td>
                <td className="price">{booking.total_price.toLocaleString()} Ft</td>
                <td>
                  <select 
                    value={booking.status} 
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    className={`status-select status-${booking.status}`}
                  >
                    <option value="pending">Függőben</option>
                    <option value="confirmed">Megerősítve</option>
                    <option value="cancelled">Lemondva</option>
                  </select>
                </td>
                <td>
                  <button 
                    onClick={() => handleStatusChange(booking.id, 'cancelled')}
                    className="action-btn delete" 
                    title="Foglalás törlése/lemondása"
                  >🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;