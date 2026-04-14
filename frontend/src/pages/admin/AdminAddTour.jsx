import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { regionsData } from '../../data/toursData'; // Javítva: két szintet kell visszalépni
import './AdminAddTour.css'; // Feltételezve egy CSS fájlt a stílusokhoz



const AdminAddTour = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    country: 'Magyarország', // Alapértelmezett érték
    region: '', // Legördülő listából választva
    type: 'daily', // Alapértelmezett érték, legördülő listából választva
    duration: '',
    price: '',
    image: '',
    max_participants: 15,
    highlights: [],
    included: [],
    not_included: [],
    meta_title: '',
    meta_description: '',
    status: 'active', // Alapértelmezett érték, legördülő listából választva
    destinations: [],
    dates: [{ start_date: '', end_date: '', available_spots: 15 }], // Kezdeti dátum mező
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const tourTypes = [
    { value: 'daily', label: 'Városi séta (Egynapos)' },
    { value: 'upcoming', label: 'Közelgő (Többnapos)' },
    { value: 'long', label: 'Hosszú (Többnapos)' },
    { value: 'multi', label: 'Multi-day (Többnapos)' },
  ];

  const tourStatuses = [
    { value: 'active', label: 'Aktív' },
    { value: 'draft', label: 'Vázlat' },
  ];

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

    try {
      // Biztosítjuk, hogy az ár és a max_participants számok legyenek
      const dataToSend = {
        ...formData,
        price: parseInt(formData.price, 10),
        max_participants: parseInt(formData.max_participants, 10),
        // Kiszűrjük az üres stringeket a tömbökből
        highlights: formData.highlights.filter(item => item.trim() !== ''),
        included: formData.included.filter(item => item.trim() !== ''),
        not_included: formData.not_included.filter(item => item.trim() !== ''),
        destinations: formData.destinations.filter(item => item.trim() !== ''),
        dates: formData.dates.filter(date => date.start_date.trim() !== ''),
      };

      const token = localStorage.getItem('token'); // Feltételezve, hogy a token a localStorage-ban van tárolva
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tours`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(res.data.message);
      // Opcionálisan visszaállíthatjuk az űrlapot vagy navigálhatunk
      // setFormData(...)
      navigate('/admin/tours'); // Átirányítás az admin túrák listájára
    } catch (err) {
      console.error('Hiba a túra létrehozásakor:', err);
      setError(err.response?.data?.message || 'Ismeretlen hiba történt.');
    }
  };

  return (
    <div className="admin-add-tour-container">
      <h2>Új túra hozzáadása</h2>
      <form onSubmit={handleSubmit} className="tour-form">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-group">
          <label htmlFor="title">Cím:</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="description">Leírás:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} required></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="city">Város:</label>
          <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="country">Ország:</label>
          <input type="text" id="country" name="country" value={formData.country} onChange={handleChange} required />
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

        <div className="form-group">
          <label htmlFor="type">Túra típusa:</label>
          <select id="type" name="type" value={formData.type} onChange={handleChange} required>
            {tourTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="duration">Időtartam:</label>
          <input type="text" id="duration" name="duration" value={formData.duration} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="price">Ár (Ft):</label>
          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="image">Kép URL/Fájlnév:</label>
          <input type="text" id="image" name="image" value={formData.image} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="max_participants">Max. résztvevők:</label>
          <input type="number" id="max_participants" name="max_participants" value={formData.max_participants} onChange={handleChange} />
        </div>

        {/* Dinamikus mezők a kiemelésekhez, tartalmazott/nem tartalmazott elemekhez, úti célokhoz */}
        {['highlights', 'included', 'not_included', 'destinations'].map(field => (
          <div className="form-group" key={field}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ')}:</label>
            {formData[field].map((item, index) => (
              <div key={index} className="array-item">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange(field, index, e.target.value)}
                />
                <button type="button" onClick={() => removeArrayItem(field, index)} className="remove-btn">X</button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem(field)} className="add-btn">Add {field.replace(/_/g, ' ')}</button>
          </div>
        ))}

        {/* Dinamikus mezők az időpontokhoz */}
        <div className="form-group">
          <label>Időpontok:</label>
          {formData.dates.map((date, index) => (
            <div key={index} className="date-item">
              <input
                type="date"
                value={date.start_date}
                onChange={(e) => handleDateChange(index, 'start_date', e.target.value)}
                required
              />
              <input
                type="date"
                value={date.end_date}
                onChange={(e) => handleDateChange(index, 'end_date', e.target.value)}
              />
              <input
                type="number"
                min="1"
                value={date.available_spots}
                onChange={(e) => handleDateChange(index, 'available_spots', e.target.value)}
                placeholder="Elérhető helyek"
              />
              <button type="button" onClick={() => removeDate(index)} className="remove-btn">X</button>
            </div>
          ))}
          <button type="button" onClick={addDate} className="add-btn">Időpont hozzáadása</button>
        </div>

        <div className="form-group">
          <label htmlFor="meta_title">Meta Cím:</label>
          <input type="text" id="meta_title" name="meta_title" value={formData.meta_title} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="meta_description">Meta Leírás:</label>
          <textarea id="meta_description" name="meta_description" value={formData.meta_description} onChange={handleChange}></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="status">Státusz:</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange} required>
            {tourStatuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-btn">Túra létrehozása</button>
      </form>
    </div>
  );
};

export default AdminAddTour;