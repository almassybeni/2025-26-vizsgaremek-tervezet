import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toursData } from '../../data/toursData';
import BackButton from '../../components/BackButton';
import './AdminAddTour.css';

const AdminEditTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    country: 'Magyarország',
    region: 'Közép-Európa',
    duration: '',
    price: '',
    image: null,
    currentImage: '',
    maxParticipants: 15,
    destinations: [''],
    dates: [{ date: '', availableSpots: 15 }],
    highlights: ['', '', '', '', ''],
    included: ['Helyi idegenvezető', 'Ételkóstolók', 'Borkóstoló', 'Belépők'],
    notIncluded: ['Szállás', 'Utazási költségek', 'Személyes kiadások'],
    metaTitle: '',
    metaDescription: '',
    slug: '',
    status: 'active'
  });

  useEffect(() => {
    // Túra adatok betöltése
    const tour = toursData.find(t => t.id === parseInt(id));
    
    if (tour) {
      // Destinations feldarabolása
      const destinations = tour.celpontok || ['', '', ''];
      
      setFormData({
        title: tour.cim || '',
        description: tour.leiras || '',
        city: tour.varos || '',
        country: tour.orszag || 'Magyarország',
        region: tour.regio || 'Közép-Európa',
        duration: tour.idotartam || '',
        price: tour.ar ? tour.ar.replace(' Ft', '') : '',
        image: null,
        currentImage: tour.kep || '',
        maxParticipants: 15,
        destinations: destinations,
        dates: [{ date: '2024-06-15', availableSpots: 15 }],
        highlights: ['Helyi piac látogatás', 'Autentikus ételkóstolók', 'Helyi termelők megismerése', 'Borkóstoló pincelátogatással', 'Magyar gasztronómiai bemutató'],
        included: ['Helyi idegenvezető', 'Ételkóstolók', 'Borkóstoló', 'Belépők'],
        notIncluded: ['Szállás', 'Utazási költségek', 'Személyes kiadások'],
        metaTitle: tour.cim || '',
        metaDescription: tour.leiras ? tour.leiras.substring(0, 160) : '',
        slug: tour.cim ? tour.cim.toLowerCase().replace(/\s+/g, '-') : '',
        status: 'active'
      });
      
      // Ha van kép, beállítjuk az előnézetet
      if (tour.kep) {
        setImagePreview(`/src/assets/images/${tour.kep}`);
      }
    }
    
    setInitialLoading(false);
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDestinationChange = (index, value) => {
    const newDestinations = [...formData.destinations];
    newDestinations[index] = value;
    setFormData({ ...formData, destinations: newDestinations });
  };

  const addDestination = () => {
    setFormData({ ...formData, destinations: [...formData.destinations, ''] });
  };

  const removeDestination = (index) => {
    if (formData.destinations.length > 1) {
      const newDestinations = formData.destinations.filter((_, i) => i !== index);
      setFormData({ ...formData, destinations: newDestinations });
    }
  };

  const handleDateChange = (index, field, value) => {
    const newDates = [...formData.dates];
    newDates[index] = { ...newDates[index], [field]: value };
    setFormData({ ...formData, dates: newDates });
  };

  const addDate = () => {
    setFormData({ 
      ...formData, 
      dates: [...formData.dates, { date: '', availableSpots: formData.maxParticipants }] 
    });
  };

  const removeDate = (index) => {
    if (formData.dates.length > 1) {
      const newDates = formData.dates.filter((_, i) => i !== index);
      setFormData({ ...formData, dates: newDates });
    }
  };

  const handleHighlightChange = (index, value) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData({ ...formData, highlights: newHighlights });
  };

  const handleIncludedChange = (index, value) => {
    const newIncluded = [...formData.included];
    newIncluded[index] = value;
    setFormData({ ...formData, included: newIncluded });
  };

  const addIncluded = () => {
    setFormData({ ...formData, included: [...formData.included, ''] });
  };

  const removeIncluded = (index) => {
    if (formData.included.length > 1) {
      const newIncluded = formData.included.filter((_, i) => i !== index);
      setFormData({ ...formData, included: newIncluded });
    }
  };

  const handleNotIncludedChange = (index, value) => {
    const newNotIncluded = [...formData.notIncluded];
    newNotIncluded[index] = value;
    setFormData({ ...formData, notIncluded: newNotIncluded });
  };

  const addNotIncluded = () => {
    setFormData({ ...formData, notIncluded: [...formData.notIncluded, ''] });
  };

  const removeNotIncluded = (index) => {
    if (formData.notIncluded.length > 1) {
      const newNotIncluded = formData.notIncluded.filter((_, i) => i !== index);
      setFormData({ ...formData, notIncluded: newNotIncluded });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validáció
      if (!formData.title || !formData.description || !formData.city || !formData.duration || !formData.price) {
        alert('Kérlek tölts ki minden kötelező mezőt!');
        setLoading(false);
        return;
      }

      if (formData.destinations.some(d => !d.trim())) {
        alert('Minden célpont mezőt ki kell tölteni!');
        setLoading(false);
        return;
      }

      // Itt kellene backend hívás a túra frissítéséhez
      // Most szimuláljuk a sikeres mentést
      setTimeout(() => {
        alert('Túra sikeresen frissítve!');
        navigate('/admin/tours');
      }, 1500);

    } catch (error) {
      console.error('Hiba a túra frissítésekor:', error);
      alert('Hiba történt a túra mentése során.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Biztosan törölni szeretnéd ezt a túrát? Ez a művelet nem visszavonható!')) {
      // Itt kellene backend hívás a törléshez
      alert('Túra törölve!');
      navigate('/admin/tours');
    }
  };

  if (initialLoading) {
    return (
      <div className="admin-add-tour">
        <BackButton to="/admin/tours" label="Vissza a túrákhoz" />
        <div className="loading-spinner">Túra adatainak betöltése...</div>
      </div>
    );
  }

  return (
    <div className="admin-add-tour">
      <BackButton to="/admin/tours" label="Vissza a túrákhoz" />
      
      <div className="add-tour-header">
        <h2>Túra szerkesztése: {formData.title}</h2>
        <div className="header-actions">
          <button className="preview-btn" onClick={() => window.open(`/tour/${id}`, '_blank')}>
            <span className="btn-icon">👁️</span>
            Megtekintés az oldalon
          </button>
          <button className="delete-btn" onClick={handleDelete}>
            <span className="btn-icon">🗑️</span>
            Túra törlése
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="add-tour-form">
        <div className="form-grid">
          {/* Bal oldal - Alapadatok */}
          <div className="form-section">
            <h3>Alapadatok</h3>
            
            <div className="form-group">
              <label htmlFor="title">Túra neve *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Pl. Budapesti Nagypiac túra"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Leírás *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="6"
                placeholder="Részletes leírás a túráról..."
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="city">Város *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Pl. Budapest"
                  required
                />
              </div>

              <div className="form-group half">
                <label htmlFor="country">Ország</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                >
                  <option value="Magyarország">Magyarország</option>
                  <option value="Ausztria">Ausztria</option>
                  <option value="Szlovákia">Szlovákia</option>
                  <option value="Horvátország">Horvátország</option>
                  <option value="Szlovénia">Szlovénia</option>
                  <option value="Lengyelország">Lengyelország</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="region">Régió</label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                >
                  <option value="Közép-Európa">Közép-Európa</option>
                  <option value="Dél-Európa">Dél-Európa</option>
                  <option value="Nyugat-Európa">Nyugat-Európa</option>
                  <option value="Kelet-Európa">Kelet-Európa</option>
                </select>
              </div>

              <div className="form-group half">
                <label htmlFor="duration">Időtartam *</label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="Pl. 6 óra"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="price">Ár (Ft) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="18990"
                  min="0"
                  required
                />
              </div>

              <div className="form-group half">
                <label htmlFor="maxParticipants">Max. létszám</label>
                <input
                  type="number"
                  id="maxParticipants"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  min="1"
                  max="50"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="status">Státusz</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Aktív</option>
                <option value="inactive">Inaktív</option>
                <option value="draft">Piszkozat</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="image">Túra képe</label>
              <div className="image-upload">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                <div className="upload-placeholder">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Előnézet" className="image-preview" />
                  ) : (
                    <>
                      <span className="upload-icon">📸</span>
                      <span className="upload-text">Kattints a kép feltöltéséhez</span>
                      <span className="upload-hint">JPG, PNG, GIF (max. 5MB)</span>
                    </>
                  )}
                </div>
              </div>
              {formData.currentImage && !imagePreview && (
                <p className="current-image">Jelenlegi kép: {formData.currentImage}</p>
              )}
            </div>
          </div>

          {/* Jobb oldal - Célpontok és időpontok */}
          <div className="form-section">
            <h3>Célpontok</h3>
            
            {formData.destinations.map((destination, index) => (
              <div key={index} className="destination-row">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => handleDestinationChange(index, e.target.value)}
                  placeholder={`Célpont ${index + 1}`}
                  className="destination-input"
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeDestination(index)}
                  disabled={formData.destinations.length === 1}
                >
                  ✕
                </button>
              </div>
            ))}
            
            <button type="button" className="add-btn" onClick={addDestination}>
              <span className="btn-icon">➕</span>
              További célpont hozzáadása
            </button>

            <h3 className="section-spacer">Időpontok</h3>
            
            {formData.dates.map((dateObj, index) => (
              <div key={index} className="date-row">
                <input
                  type="date"
                  value={dateObj.date}
                  onChange={(e) => handleDateChange(index, 'date', e.target.value)}
                  className="date-input"
                />
                <input
                  type="number"
                  value={dateObj.availableSpots}
                  onChange={(e) => handleDateChange(index, 'availableSpots', parseInt(e.target.value))}
                  placeholder="Helyek"
                  min="1"
                  max="50"
                  className="spots-input"
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeDate(index)}
                  disabled={formData.dates.length === 1}
                >
                  ✕
                </button>
              </div>
            ))}
            
            <button type="button" className="add-btn" onClick={addDate}>
              <span className="btn-icon">➕</span>
              További időpont hozzáadása
            </button>
          </div>
        </div>

        {/* Programterv */}
        <div className="form-section full-width">
          <h3>Programterv (kiemelések)</h3>
          <div className="highlights-grid">
            {formData.highlights.map((highlight, index) => (
              <div key={index} className="highlight-row">
                <span className="highlight-icon">✅</span>
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) => handleHighlightChange(index, e.target.value)}
                  placeholder={`Programpont ${index + 1}`}
                  className="highlight-input"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mit tartalmaz / Mit nem tartalmaz */}
        <div className="form-grid">
          <div className="form-section">
            <h3>Mit tartalmaz?</h3>
            {formData.included.map((item, index) => (
              <div key={index} className="included-row">
                <span className="included-icon">✅</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleIncludedChange(index, e.target.value)}
                  placeholder="Pl. Helyi idegenvezető"
                  className="included-input"
                />
                <button
                  type="button"
                  className="remove-btn-small"
                  onClick={() => removeIncluded(index)}
                  disabled={formData.included.length === 1}
                >
                  ✕
                </button>
              </div>
            ))}
            <button type="button" className="add-btn-small" onClick={addIncluded}>
              + Hozzáadás
            </button>
          </div>

          <div className="form-section">
            <h3>Mit nem tartalmaz?</h3>
            {formData.notIncluded.map((item, index) => (
              <div key={index} className="included-row">
                <span className="included-icon">❌</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleNotIncludedChange(index, e.target.value)}
                  placeholder="Pl. Szállás"
                  className="included-input"
                />
                <button
                  type="button"
                  className="remove-btn-small"
                  onClick={() => removeNotIncluded(index)}
                  disabled={formData.notIncluded.length === 1}
                >
                  ✕
                </button>
              </div>
            ))}
            <button type="button" className="add-btn-small" onClick={addNotIncluded}>
              + Hozzáadás
            </button>
          </div>
        </div>

        {/* SEO és metaadatok */}
        <div className="form-section full-width">
          <h3>SEO beállítások</h3>
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="metaTitle">Meta cím</label>
              <input
                type="text"
                id="metaTitle"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleInputChange}
                placeholder="Pl. Budapesti gasztrotúra - Nagypiac látogatás"
              />
            </div>

            <div className="form-group half">
              <label htmlFor="slug">URL azonosító (slug)</label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="budapest-nagypiac-tura"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="metaDescription">Meta leírás</label>
            <textarea
              id="metaDescription"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleInputChange}
              rows="3"
              placeholder="Rövid leírás keresőoptimalizáláshoz..."
            />
          </div>
        </div>

        {/* Mentés gombok */}
        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Mentés...
              </>
            ) : (
              <>
                <span className="btn-icon">💾</span>
                Változtatások mentése
              </>
            )}
          </button>
          <button type="button" className="cancel-btn" onClick={() => navigate('/admin/tours')}>
            Mégse
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditTour;