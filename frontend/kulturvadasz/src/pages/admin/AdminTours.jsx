import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { toursData } from '../../data/toursData';
import './Admin.css'; // Készítsünk egy közös CSS-t az adminhoz

const AdminTours = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <Header />
      <div className="admin-container">
        <div className="admin-header">
          <h2>Túrák Kezelése</h2>
          <button className="btn-primary" onClick={() => alert('Új túra hozzáadása hamarosan!')}>+ Új Túra</button>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Kép</th>
                <th>Cím</th>
                <th>Város</th>
                <th>Ár</th>
                <th>Típus</th>
                <th>Műveletek</th>
              </tr>
            </thead>
            <tbody>
              {toursData.map((tour) => (
                <tr key={tour.id}>
                  <td>
                    <img src={`/src/assets/images/${tour.kep}`} alt={tour.cim} className="admin-table-img" />
                  </td>
                  <td><strong>{tour.cim}</strong><br/><small>{tour.sub}</small></td>
                  <td>{tour.varos}</td>
                  <td>{tour.ar}</td>
                  <td><span className={`badge ${tour.type}`}>{tour.type}</span></td>
                  <td>
                    <button className="btn-edit" onClick={() => navigate(`/admin/edit/${tour.id}`)}>Szerkesztés</button>
                    <button className="btn-delete" onClick={() => alert('Törlés funkció!')}>Törlés</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTours;