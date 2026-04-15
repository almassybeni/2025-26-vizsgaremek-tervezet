import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { regionsData } from '../../data/toursData';
import './AdminAddTour.css'; // Újrahasznosítjuk a meglévő stílusokat

const AdminEditTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    country: 'Magyarország',
    region: '',
    type: 'daily',
    duration: '',
    price: '',
    image: '',
    max_participants: 15,
    highlights: [],
    included: [],
    not_included: [],
    meta_title: '',
    meta_description: '',
    status: 'active',
    destinations: [],
    dates: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tourTypes = [
    { value: 'daily', label: 'Városi séta (Egynapos)' },
    { value: 'upcoming', label: 'Közelgő (Többnapos)' },
    { value: 'long', label: 'Hosszú (Többnapos)' },
    { value: 'multi', label: 'Multi-day (Többnapos)' },
  ];

  const tourStatuses = [
    { value: 'active', label: 'Aktív' },
    { value: 'inactive', label: 'Inaktív' },
    { value: 'draft', label: 'Vázlat' },
  ];

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tours/${id}`);
        const tour = res.data;

        setFormData({
          title: tour.title || '',
          description: tour.description || '',
          city: tour.city || '',
          country: tour.country || 'Magyarország',
          region: tour.region || '',
          type: tour.type || 'daily',
          duration: tour.duration || '',
          price: tour.price || '',
          image: tour.image || '',
          max_participants: tour.max_participants || 15,
          highlights: Array.isArray(tour.highlights) ? tour.highlights : [],
          included: Array.isArray(tour.included) ? tour.included : [],
          not_included: Array.isArray(tour.not_included) ? tour.not_included : [],
          meta_title: tour.meta_title || '',
          meta_description: tour.meta_description || '',
          status: tour.is_active ? 'active' : 'inactive',
          // A backend GROUP_CONCAT-al küldi a desztinációkat, tömbbé kell alakítani
          destinations: tour.destinations ? tour.destinations.split(',') : [],
          dates: tour.dates ? tour.dates.map(d => ({
            ...d,
            start_date: d.start_date ? new Date(d.start_date).toISOString().split('T')[0] : '',
            end_date: d.end_date ? new Date(d.end_date).toISOString().split('T')[0] : ''
          })) : [],
        });
        setLoading(false);
      } catch (err) {
        console.error('Hiba az adatok betöltésekor:', err);
        setError('Nem sikerült betölteni a túra adatait.');
        setLoading(false);
      }
    };

    fetchTourData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => {
      const newArray = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: newArray };
    });
  };

  const handleDateChange = (index, field, value) => {
    setFormData(prev => {
      const newDates = [...prev.dates];
      newDates[index] = { ...newDates[index], [field]: value };
      return { ...prev, dates: newDates };
    });
  };

  const addDate = () => {
    setFormData(prev => ({
      ...prev,
      dates: [...prev.dates, { start_date: '', end_date: '', available_spots: prev.max_participants }],
    }));
  };

  const removeDate = (index) => {
    setFormData(prev => ({
      ...prev,
      dates: prev.dates.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tours/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(res.data.message);
      setTimeout(() => navigate('/admin/tours'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Hiba történt a mentés során.');
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="admin-add-tour-container">Betöltés...</div>;

  return (
    <div className="admin-add-tour-container">
      <h2>Túra szerkesztése: {formData.title}</h2>
      <form onSubmit={handleSubmit} className="tour-form">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-group">
          <label>Cím:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Leírás:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Ár (Ft):</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="region">Régió:</label>
          <select id="region" name="region" value={formData.region} onChange={handleChange} required>
            <option value="">Válassz régiót</option>
            {regionsData.map(region => (
              <option key={region.id} value={region.id}>{region.name}</option>
            ))}
          </select>
        </div>

        {/* Highlights dinamikus mezők */}
        <div className="form-group">
          <label>Kiemelések (Highlights):</label>
          {formData.highlights.map((item, index) => (
            <div key={index} className="array-item">
              <input type="text" value={item} onChange={(e) => handleArrayChange('highlights', index, e.target.value)} />
              <button type="button" onClick={() => removeArrayItem('highlights', index)} className="remove-btn">X</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem('highlights')} className="add-btn">Kiemelés hozzáadása</button>
        </div>

        <div className="form-group">
          <label>Státusz:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            {tourStatuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Mentés...' : 'Módosítások mentése'}
        </button>
      </form>
    </div>
  );
};

export default AdminEditTour;