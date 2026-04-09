import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Itt küldhetnéd el az üzenetet a backendnek
    // Most csak szimuláljuk a sikeres küldést
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // 5 másodperc múlva eltüntetjük a sikeres üzenetet
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="contact-page">
      <Header />
      
      <main>
        <div className="contact-hero">
          <div className="container">
            <h1>Kapcsolat</h1>
            <p>Lépj kapcsolatba velünk bármilyen kérdés esetén</p>
          </div>
        </div>

        <section className="contact-content">
          <div className="container">
            <div className="contact-grid">
              {/* Bal oldal - Elérhetőségek */}
              <div className="contact-info">
                <h2>Elérhetőségeink</h2>
                
                <div className="info-cards">
                  <div className="info-card">
                    <div className="info-icon">📍</div>
                    <div className="info-details">
                      <h3>Cím</h3>
                      <p>1052 Budapest, Váci utca 20.</p>
                      <p className="info-note">Nyitva: H-P 9:00 - 18:00</p>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-icon">📞</div>
                    <div className="info-details">
                      <h3>Telefon</h3>
                      <p><a href="tel:+36123456789">+36 1 234 5678</a></p>
                      <p><a href="tel:+36301234567">+36 30 123 4567</a></p>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-icon">✉️</div>
                    <div className="info-details">
                      <h3>Email</h3>
                      <p><a href="mailto:info@gasztrokalandok.hu">info@gasztrokalandok.hu</a></p>
                      <p><a href="mailto:booking@gasztrokalandok.hu">booking@gasztrokalandok.hu</a></p>
                    </div>
                  </div>

                  
                </div>

                <div className="map-container">
                  <h3>Itt találsz minket</h3>
                  <div className="map-placeholder">
                    {/* Itt jöhet egy Google Maps beágyazás */}
                    <iframe
                      title="GasztroKalandok iroda"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2695.123456789!2d19.054545!3d47.497912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741dc0a5f5f5f5f%3A0x123456789!2sBudapest%2C%20V%C3%A1ci%20utca%2020!5e0!3m2!1shu!2shu!4v1234567890"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>

              {/* Jobb oldal - Kapcsolatfelvételi űrlap */}
              <div className="contact-form-container">
                <h2>Küldj üzenetet</h2>
                <p className="form-intro">
                  Ha kérdésed van, vagy segítségre van szükséged, töltsd ki az űrlapot, 
                  és munkatársunk hamarosan felveszi veled a kapcsolatot.
                </p>

                {success && (
                  <div className="success-message">
                    <span className="success-icon">✅</span>
                    <div className="success-content">
                      <h3>Üzenet elküldve!</h3>
                      <p>Köszönjük megkeresésed, hamarosan válaszolunk.</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="error-message">
                    ❌ {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Név *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Teljes neved"
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email cím *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="pelda@email.hu"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Telefonszám</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+36 30 123 4567"
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="subject">Tárgy *</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="Üzenet tárgya"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Üzenet *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      placeholder="Írd ide az üzeneted..."
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group checkbox">
                    <input
                      type="checkbox"
                      id="consent"
                      required
                      disabled={loading}
                    />
                    <label htmlFor="consent">
                      Elfogadom az <a href="/adatvedelem">adatvédelmi nyilatkozatot</a> *
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading-spinner-small">Küldés...</span>
                    ) : (
                      'Üzenet küldése'
                    )}
                  </button>
                </form>

                <div className="response-time">
                  <span className="time-icon">⏱️</span>
                  <p>Átlagos válaszidő: 24 óra</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gyakori kérdések szekció */}
        <section className="faq-section">
          <div className="container">
            <h2>Gyakori kérdések</h2>
            
            <div className="faq-grid">
              <div className="faq-item">
                <h3>Hogyan tudok foglalni?</h3>
                <p>Foglalni a weboldalunkon keresztül tudsz a "Túrák" menüpontban. Válaszd ki a kívánt túrát, és kattints a "Foglalás" gombra.</p>
              </div>

              <div className="faq-item">
                <h3>Lemondhatom a foglalásomat?</h3>
                <p>Igen, a foglalásodat 48 órával a túra előtt ingyenesen lemondhatod a profilodban.</p>
              </div>

              <div className="faq-item">
                <h3>Milyen nyelveken vezetitek a túrákat?</h3>
                <p>Túráinkat magyar és angol nyelven is vezetjük. Kérésre német nyelvű túrát is tudunk szervezni.</p>
              </div>

              <div className="faq-item">
                <h3>Csoportos kedvezmény?</h3>
                <p>Igen, 6 fő feletti csoportoknak kedvezményt biztosítunk. Vedd fel velünk a kapcsolatot egyedi ajánlatért.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;