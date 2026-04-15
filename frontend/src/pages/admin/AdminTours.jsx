import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BackButton from '../../components/BackButton';
import './AdminTours.css';

const AdminTours = () => {
  const { token } = useAuth();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tours');
      setTours(res.data);
    } catch (error) {
      console.error('Hiba a túrák betöltésekor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Biztosan törölni szeretnéd ezt a túrát?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tours/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTours(tours.filter(t => t.id !== id));
      } catch (error) {
        alert('Hiba történt a törlés során.');
      }
    }
  };

  const filteredTours = tours.filter(tour =>
    tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading-spinner">Túrák betöltése...</div>;

  return (
    <div className="admin-tours">
      <BackButton to="/admin" label="Vissza a vezérlőpultra" />
      
      <div className="admin-tours-header">
        <div>
          <h2>Túrák kezelése</h2>
          <p className="tour-count">Összesen: {tours.length} túra</p>
        </div>
        <Link to="/admin/add-tour" className="add-button">
          <span className="add-icon">+</span> Új túra hozzáadása
        </Link>
      </div>

      <div className="tours-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Keresés túra neve vagy város alapján..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="tours-table-container">
        <table className="tours-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Kép</th>
              <th>Megnevezés</th>
              <th>Város</th>
              <th>Ár</th>
              <th>Típus</th>
              <th>Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {filteredTours.map(tour => (
              <tr key={tour.id}>
                <td className="id-cell">#{tour.id}</td>
                <td className="image-cell">
                  <img src={`/src/assets/images/${tour.image}`} alt={tour.title} className="tour-thumbnail" />
                </td>
                <td className="title-cell">{tour.title}</td>
                <td>{tour.city}</td>
                <td className="price-cell">{tour.price.toLocaleString()} Ft</td>
                <td><span className={`status-badge ${tour.type}`}>{tour.type}</span></td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <Link to={`/admin/edit/${tour.id}`} className="action-btn edit" title="Szerkesztés">✏️</Link>
                    <button onClick={() => handleDelete(tour.id)} className="action-btn delete" title="Törlés">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTours;