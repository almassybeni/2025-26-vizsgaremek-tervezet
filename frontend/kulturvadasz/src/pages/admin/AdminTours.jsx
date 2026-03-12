import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toursData } from '../../data/toursData';
import BackButton from '../../components/BackButton';
import './AdminTours.css';

const AdminTours = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [sortBy, setSortBy] = useState('id');

  useEffect(() => {
    // Adatok betöltése
    setTimeout(() => {
      setTours(toursData);
      setLoading(false);
    }, 500);
  }, []);

  // Egyedi városok listája a szűrőhöz
  const cities = ['all', ...new Set(tours.map(tour => tour.varos))];

  const filteredTours = tours.filter(tour => {
    const matchesSearch = 
      tour.cim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.varos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.orszag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.leiras.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = filterCity === 'all' || tour.varos === filterCity;
    
    // Státusz szűrés (most minden aktív)
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && true) ||
      (filterStatus === 'inactive' && false);
    
    return matchesSearch && matchesCity && matchesStatus;
  });

  const sortedTours = [...filteredTours].sort((a, b) => {
    switch(sortBy) {
      case 'name':
        return a.cim.localeCompare(b.cim);
      case 'city':
        return a.varos.localeCompare(b.varos);
      case 'price-asc':
        return parseInt(a.ar.replace(' Ft', '')) - parseInt(b.ar.replace(' Ft', ''));
      case 'price-desc':
        return parseInt(b.ar.replace(' Ft', '')) - parseInt(a.ar.replace(' Ft', ''));
      case 'id':
      default:
        return a.id - b.id;
    }
  });

  const handleEditTour = (id) => {
    navigate(`/admin/tours/edit/${id}`);
  };

  const handleAddTour = () => {
    navigate('/admin/tours/new');
  };

  const handleDeleteTour = (id) => {
    if (window.confirm('Biztosan törölni szeretnéd ezt a túrát?')) {
      setTours(tours.filter(tour => tour.id !== id));
    }
  };

  const handleViewTour = (id) => {
    window.open(`/tour/${id}`, '_blank');
  };

  const getStatusBadge = (tour) => {
    // Itt lehetne státusz logika
    return <span className="status-badge active">Aktív</span>;
  };

  const formatPrice = (price) => {
    return price;
  };

  if (loading) {
    return (
      <div className="admin-tours">
        <BackButton to="/admin" label="Vissza a vezérlőpultra" />
        <div className="loading-spinner">Túrák betöltése...</div>
      </div>
    );
  }

  return (
    <div className="admin-tours">
      <BackButton to="/admin" label="Vissza a vezérlőpultra" />
      
      <div className="admin-tours-header">
        <div>
          <h2>Túrák kezelése</h2>
          <p className="tour-count">Összesen {filteredTours.length} túra</p>
        </div>
        <button className="add-button" onClick={handleAddTour}>
          <span className="add-icon">➕</span>
          Új túra hozzáadása
        </button>
      </div>

      <div className="tours-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Keresés túra név, város vagy leírás alapján..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-group">
          <select 
            value={filterCity} 
            onChange={(e) => setFilterCity(e.target.value)}
            className="filter-select"
          >
            <option value="all">Minden város</option>
            {cities.filter(c => c !== 'all').map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Minden státusz</option>
            <option value="active">Aktív</option>
            <option value="inactive">Inaktív</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="id">ID szerint</option>
            <option value="name">Név szerint (A-Z)</option>
            <option value="city">Város szerint</option>
            <option value="price-asc">Ár szerint (növekvő)</option>
            <option value="price-desc">Ár szerint (csökkenő)</option>
          </select>
        </div>
      </div>

      {filteredTours.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>Nincs találat</h3>
          <p>Próbáld meg más keresési feltételekkel.</p>
          <button 
            className="clear-filters-btn"
            onClick={() => {
              setSearchTerm('');
              setFilterCity('all');
              setFilterStatus('all');
              setSortBy('id');
            }}
          >
            Szűrők törlése
          </button>
        </div>
      ) : (
        <div className="tours-table-container">
          <table className="tours-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Kép</th>
                <th>Túra neve</th>
                <th>Város</th>
                <th>Ország</th>
                <th>Időtartam</th>
                <th>Ár</th>
                <th>Célpontok</th>
                <th>Státusz</th>
                <th>Műveletek</th>
              </tr>
            </thead>
            <tbody>
              {sortedTours.map(tour => (
                <tr key={tour.id}>
                  <td className="id-cell">#{tour.id}</td>
                  <td className="image-cell">
                    <img 
                      src={`/src/assets/images/${tour.kep}`} 
                      alt={tour.cim}
                      className="tour-thumbnail"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/src/assets/images/placeholder.jpg';
                      }}
                    />
                  </td>
                  <td className="title-cell">
                    <div className="tour-title">{tour.cim}</div>
                    <div className="tour-description-preview">
                      {tour.leiras.substring(0, 60)}...
                    </div>
                  </td>
                  <td>{tour.varos}</td>
                  <td>{tour.orszag}</td>
                  <td className="duration-cell">{tour.idotartam}</td>
                  <td className="price-cell">{formatPrice(tour.ar)}</td>
                  <td className="destinations-cell">
                    <div className="destinations-list">
                      {tour.celpontok?.slice(0, 2).map((dest, idx) => (
                        <span key={idx} className="destination-tag">{dest}</span>
                      ))}
                      {tour.celpontok?.length > 2 && (
                        <span className="destination-more">+{tour.celpontok.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td>{getStatusBadge(tour)}</td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button 
                        className="action-btn view"
                        onClick={() => handleViewTour(tour.id)}
                        title="Megtekintés"
                      >
                        👁️
                      </button>
                      <button 
                        className="action-btn edit"
                        onClick={() => handleEditTour(tour.id)}
                        title="Szerkesztés"
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDeleteTour(tour.id)}
                        title="Törlés"
                      >
                        🗑️
                      </button>
                      <button 
                        className="action-btn copy"
                        onClick={() => {
                          navigator.clipboard.writeText(`/tour/${tour.id}`);
                          alert('Link másolva!');
                        }}
                        title="Link másolás"
                      >
                        🔗
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Statisztika láb rész */}
      <div className="tours-footer-stats">
        <div className="stat-item">
          <span className="stat-label">Összes túra:</span>
          <span className="stat-value">{tours.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Megjelenítve:</span>
          <span className="stat-value">{filteredTours.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Legolcsóbb:</span>
          <span className="stat-value">
            {Math.min(...tours.map(t => parseInt(t.ar.replace(' Ft', '')))).toLocaleString()} Ft
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Legdrágább:</span>
          <span className="stat-value">
            {Math.max(...tours.map(t => parseInt(t.ar.replace(' Ft', '')))).toLocaleString()} Ft
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminTours;