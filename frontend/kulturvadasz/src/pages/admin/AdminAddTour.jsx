import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BackButton from '../../components/BackButton';
import './AdminAddTour.css';

const AdminAddTour = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    country: 'Magyarország',
    region: 'Közép-Európa',
    duration: '',
    price: '',
    image: null,
    maxParticipants: 15,
    destinations: [''],
    dates: [{ date: '', availableSpots: 15 }],
    highlights: ['', '', '', '', ''],
    included: ['Helyi idegenvezető', 'Ételkóstolók', 'Borkóstoló', 'Belépők'],
    notIncluded: ['Szállás', 'Utazási költségek', 'Személyes kiadások'],
    metaTitle: '',
    metaDescription: '',
    slug: '',
    status: 'draft'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9áéíóöőúüű]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('A kép mérete nem lehet nagyobb 5MB-nál!');
        return;
      }
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

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('A túra neve kötelező!');
      return false;
    }
    if (!formData.description.trim()) {
      setError('A leírás kötelező!');
      return false;
    }
    if (!formData.city.trim()) {
      setError('A város megadása kötelező!');
      return false;
    }
    if (!formData.duration.trim()) {
      setError('Az időtartam megadása kötelező!');
      return false;
    }
    if (!formData.price || formData.price <= 0) {
      setError('Az ár megadása kötelező!');
      return false;
    }
    if (formData.destinations.some(d => !d.trim())) {
      setError('Minden célpont mezőt ki kell tölteni!');
      return false;
    }
    return true;
  };

  // 🔴 A JAVÍTOTT BEKÜLDÉSI LOGIKA
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let uploadedImageName = 'placeholder.jpg';

      // 1. KÉPFELTÖLTÉS (Ha van kiválasztott fájl)
      if (formData.image && typeof formData.image !== 'string') {
        const imageForm = new FormData();
        imageForm.append('image', formData.image);

        const uploadRes = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: imageForm // FormData-t küldünk, nem JSON-t!
        });

        const uploadData = await uploadRes.json();

        if (uploadRes.ok) {
          uploadedImageName = uploadData.filename; // Megkapjuk a generált fájlnevet
        } else {
          setError(uploadData.message || 'Hiba a kép feltöltésekor');
          setLoading(false);
          return;
        }
      }

      // 2. TÚRA ADATOK MENTÉSE
      const tourData = {
        title: formData.title,
        description: formData.description,
        city: formData.city,
        country: formData.country,
        region: formData.region,
        duration: formData.duration,
        price: parseInt(formData.price),
        image: uploadedImageName, // A feltöltött kép neve kerül ide!
        max_participants: formData.maxParticipants,
        destinations: formData.destinations.filter(d => d.trim()),
        dates: formData.dates.filter(d => d.date).map(d => ({
          start_date: d.date,
          end_date: d.date,
          available_spots: d.availableSpots
        })),
        highlights: formData.highlights.filter(h => h.trim()),
        included: formData.included.filter(i => i.trim()),
        not_included: formData.notIncluded.filter(n => n.trim()),
        meta_title: formData.metaTitle || formData.title,
        meta_description: formData.metaDescription || formData.description.substring(0, 160),
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        status: formData.status
      };

      const response = await fetch('http://localhost:5000/api/tours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tourData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Túra sikeresen létrehozva!');
        navigate('/admin/tours');
      } else {
        setError(data.message || 'Hiba történt a túra mentése során');
      }
    } catch (error) {
      console.error('Hiba a túra létrehozásakor:', error);
      setError('Nem sikerült csatlakozni a szerverhez');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    setFormData({ ...formData, status: 'draft' });
    handleSubmit(new Event('submit'));
  };

  return (
    <div className="admin-add-tour">
      <BackButton to="/admin/tours" label="Vissza a túrákhoz" />
      
      <div className="add-tour-header">
        <h2>Új túra hozzáadása</h2>
        <div className="header-actions">
          <button 
            className="preview-btn" 
            type="button"
            onClick={() => {
              if (formData.slug) {
                window.open(`/tour/preview/${formData.slug}`, '_blank');
              } else {
                alert('Először add meg a túra nevét!');
              }
            }}
          >
            <span className="btn-icon">👁️</span>
            Előnézet
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

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
                disabled={loading}
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
                disabled={loading}
              />
              <small className="field-note">
                {formData.description.length} / 2000 karakter
              </small>
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
                  disabled={loading}
                />
              </div>

              <div className="form-group half">
                <label htmlFor="country">Ország</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                disabled={loading}
              >
                <option value="draft">Piszkozat</option>
                <option value="active">Aktív</option>
                <option value="inactive">Inaktív</option>
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
                  disabled={loading}
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
                  disabled={loading}
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeDestination(index)}
                  disabled={formData.destinations.length === 1 || loading}
                >
                  ✕
                </button>
              </div>
            ))}
            
            <button 
              type="button" 
              className="add-btn" 
              onClick={addDestination}
              disabled={loading}
            >
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
                  disabled={loading}
                />
                <input
                  type="number"
                  value={dateObj.availableSpots}
                  onChange={(e) => handleDateChange(index, 'availableSpots', parseInt(e.target.value))}
                  placeholder="Helyek"
                  min="1"
                  max="50"
                  className="spots-input"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeDate(index)}
                  disabled={formData.dates.length === 1 || loading}
                >
                  ✕
                </button>
              </div>
            ))}
            
            <button 
              type="button" 
              className="add-btn" 
              onClick={addDate}
              disabled={loading}
            >
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
                  disabled={loading}
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
                  disabled={loading}
                />
                <button
                  type="button"
                  className="remove-btn-small"
                  onClick={() => removeIncluded(index)}
                  disabled={formData.included.length === 1 || loading}
                >
                  ✕
                </button>
              </div>
            ))}
            <button 
              type="button" 
              className="add-btn-small" 
              onClick={addIncluded}
              disabled={loading}
            >
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
                  disabled={loading}
                />
                <button
                  type="button"
                  className="remove-btn-small"
                  onClick={() => removeNotIncluded(index)}
                  disabled={formData.notIncluded.length === 1 || loading}
                >
                  ✕
                </button>
              </div>
            ))}
            <button 
              type="button" 
              className="add-btn-small" 
              onClick={addNotIncluded}
              disabled={loading}
            >
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
                disabled={loading}
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
                disabled={loading}
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
              disabled={loading}
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
                Túra mentése
              </>
            )}
          </button>
          <button 
            type="button" 
            className="draft-btn" 
            onClick={handleSaveAsDraft}
            disabled={loading}
          >
            Piszkozatként mentés
          </button>
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={() => navigate('/admin/tours')}
            disabled={loading}
          >
            Mégse
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddTour;