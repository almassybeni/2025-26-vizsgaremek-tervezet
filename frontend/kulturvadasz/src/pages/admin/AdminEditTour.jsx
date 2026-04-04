import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { toursData } from '../../data/toursData';
import './Admin.css';

const AdminEditTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);

  useEffect(() => {
    const foundTour = toursData.find(t => t.id === parseInt(id));
    if (foundTour) setTour(foundTour);
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('A változtatások sikeresen mentve! (Demo mód)');
    navigate('/admin/tours');
  };

  if (!tour) return <div>Betöltés...</div>;

  return (
    <div className="admin-page">
      <Header />
      <div className="admin-container form-container">
        <button className="btn-back" onClick={() => navigate('/admin/tours')}>← Vissza a listához</button>
        
        <h2>Túra Szerkesztése: {tour.cim}</h2>
        
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Túra Címe</label>
            <input type="text" defaultValue={tour.cim} required />
          </div>
          
          <div className="form-group">
            <label>Alcím</label>
            <input type="text" defaultValue={tour.sub} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Város</label>
              <input type="text" defaultValue={tour.varos} required />
            </div>
            <div className="form-group">
              <label>Ár</label>
              <input type="text" defaultValue={tour.ar} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Típus</label>
              <select defaultValue={tour.type}>
                <option value="upcoming">Érkező (Upcoming)</option>
                <option value="long">Többnapos (Long)</option>
                <option value="daily">Egynapos (Daily)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Kép fájlnév</label>
              <input type="text" defaultValue={tour.kep} />
            </div>
          </div>

          <button type="submit" className="btn-primary">Mentés</button>
        </form>
      </div>
    </div>
  );
};

export default AdminEditTour;