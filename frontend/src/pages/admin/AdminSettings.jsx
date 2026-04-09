import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import BackButton from '../../components/BackButton';
import './AdminSettings.css';

const AdminSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // Általános beállítások
    siteName: 'GasztroKalandok',
    siteEmail: 'info@gasztrokalandok.hu',
    sitePhone: '+36 1 234 5678',
    address: '1052 Budapest, Váci utca 20.',
    currency: 'HUF',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    maintenanceMode: false,
    
    // Foglalási beállítások
    maxParticipants: 15,
    cancellationPeriod: 48,
    autoConfirm: false,
    bookingPrefix: 'BK',
    
    // Email értesítések
    emailNotifications: true,
    bookingConfirmation: true,
    reminderEmails: true,
    marketingEmails: false,
    
    // Egyéb
    timezone: 'Europe/Budapest',
    language: 'hu'
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSettingChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveSettings = () => {
    // Itt kellene backend hívás
    alert('Beállítások sikeresen mentve!');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      alert('A jelszavak nem egyeznek!');
      return;
    }
    if (passwordData.new.length < 6) {
      alert('A jelszónak legalább 6 karakter hosszúnak kell lennie!');
      return;
    }
    if (!passwordData.current) {
      alert('A jelenlegi jelszó megadása kötelező!');
      return;
    }
    // Itt kellene backend hívás
    alert('Jelszó sikeresen megváltoztatva!');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleResetSettings = () => {
    if (window.confirm('Biztosan visszaállítod az alapértelmezett beállításokat?')) {
      setSettings({
        siteName: 'GasztroKalandok',
        siteEmail: 'info@gasztrokalandok.hu',
        sitePhone: '+36 1 234 5678',
        address: '1052 Budapest, Váci utca 20.',
        currency: 'HUF',
        dateFormat: 'YYYY-MM-DD',
        timeFormat: '24h',
        maintenanceMode: false,
        maxParticipants: 15,
        cancellationPeriod: 48,
        autoConfirm: false,
        bookingPrefix: 'BK',
        emailNotifications: true,
        bookingConfirmation: true,
        reminderEmails: true,
        marketingEmails: false,
        timezone: 'Europe/Budapest',
        language: 'hu'
      });
      alert('Beállítások visszaállítva az alapértelmezettre!');
    }
  };

  return (
    <div className="admin-settings">
      <BackButton to="/admin" label="Vissza a vezérlőpultra" />
      
      <div className="settings-header">
        <h2>Beállítások</h2>
        <div className="header-actions">
          <button className="reset-btn" onClick={handleResetSettings}>
            <span className="btn-icon">↺</span>
            Alaphelyzet
          </button>
        </div>
      </div>

      <div className="settings-tabs">
        <button 
          className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <span className="tab-icon">⚙️</span>
          Általános
        </button>
        <button 
          className={`tab-btn ${activeTab === 'booking' ? 'active' : ''}`}
          onClick={() => setActiveTab('booking')}
        >
          <span className="tab-icon">📅</span>
          Foglalási beállítások
        </button>
        <button 
          className={`tab-btn ${activeTab === 'email' ? 'active' : ''}`}
          onClick={() => setActiveTab('email')}
        >
          <span className="tab-icon">✉️</span>
          Email értesítések
        </button>
        <button 
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <span className="tab-icon">🔒</span>
          Biztonság
        </button>
      </div>

      <div className="settings-content">
        {/* Általános beállítások */}
        {activeTab === 'general' && (
          <div className="settings-form">
            <h3>Általános beállítások</h3>
            
            <div className="form-group">
              <label htmlFor="siteName">Oldal neve</label>
              <input
                type="text"
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleSettingChange('siteName', e.target.value)}
                placeholder="Pl. GasztroKalandok"
              />
            </div>

            <div className="form-group">
              <label htmlFor="siteEmail">Kapcsolattartási email</label>
              <input
                type="email"
                id="siteEmail"
                value={settings.siteEmail}
                onChange={(e) => handleSettingChange('siteEmail', e.target.value)}
                placeholder="info@gasztrokalandok.hu"
              />
            </div>

            <div className="form-group">
              <label htmlFor="sitePhone">Telefonszám</label>
              <input
                type="tel"
                id="sitePhone"
                value={settings.sitePhone}
                onChange={(e) => handleSettingChange('sitePhone', e.target.value)}
                placeholder="+36 1 234 5678"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Cím</label>
              <input
                type="text"
                id="address"
                value={settings.address}
                onChange={(e) => handleSettingChange('address', e.target.value)}
                placeholder="1052 Budapest, Váci utca 20."
              />
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="currency">Pénznem</label>
                <select
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => handleSettingChange('currency', e.target.value)}
                >
                  <option value="HUF">HUF - Forint</option>
                  <option value="EUR">EUR - Euró</option>
                  <option value="USD">USD - Dollár</option>
                </select>
              </div>

              <div className="form-group half">
                <label htmlFor="language">Nyelv</label>
                <select
                  id="language"
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                >
                  <option value="hu">Magyar</option>
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="dateFormat">Dátum formátum</label>
                <select
                  id="dateFormat"
                  value={settings.dateFormat}
                  onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                >
                  <option value="YYYY-MM-DD">ÉÉÉÉ-HH-NN (2024-03-15)</option>
                  <option value="YYYY.MM.DD">ÉÉÉÉ.HH.NN (2024.03.15)</option>
                  <option value="DD/MM/YYYY">NN/HH/ÉÉÉÉ (15/03/2024)</option>
                </select>
              </div>

              <div className="form-group half">
                <label htmlFor="timezone">Időzóna</label>
                <select
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                >
                  <option value="Europe/Budapest">Europe/Budapest (UTC+1)</option>
                  <option value="Europe/London">Europe/London (UTC+0)</option>
                  <option value="Europe/Berlin">Europe/Berlin (UTC+1)</option>
                </select>
              </div>
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
              />
              <label htmlFor="maintenanceMode">Karbantartási mód bekapcsolása</label>
              <small className="field-note">Bekapcsolásakor a weboldal csak adminok számára lesz elérhető.</small>
            </div>
          </div>
        )}

        {/* Foglalási beállítások */}
        {activeTab === 'booking' && (
          <div className="settings-form">
            <h3>Foglalási beállítások</h3>
            
            <div className="form-group">
              <label htmlFor="maxParticipants">Maximális résztvevők száma (alapértelmezett)</label>
              <input
                type="number"
                id="maxParticipants"
                min="1"
                max="50"
                value={settings.maxParticipants}
                onChange={(e) => handleSettingChange('maxParticipants', parseInt(e.target.value))}
              />
              <small className="field-note">Egy túrára jelentkezhető maximális létszám.</small>
            </div>

            <div className="form-group">
              <label htmlFor="cancellationPeriod">Lemondási határidő (óra)</label>
              <input
                type="number"
                id="cancellationPeriod"
                min="0"
                max="168"
                value={settings.cancellationPeriod}
                onChange={(e) => handleSettingChange('cancellationPeriod', parseInt(e.target.value))}
              />
              <small className="field-note">A foglalás lemondásának határideje a túra előtt órában megadva. (0 = nem lehet lemondani)</small>
            </div>

            <div className="form-group">
              <label htmlFor="bookingPrefix">Foglalás azonosító előtag</label>
              <input
                type="text"
                id="bookingPrefix"
                value={settings.bookingPrefix}
                onChange={(e) => handleSettingChange('bookingPrefix', e.target.value)}
                maxLength="5"
                placeholder="BK"
              />
              <small className="field-note">Pl. BK-2024-001 formátumban jelenik meg.</small>
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="autoConfirm"
                checked={settings.autoConfirm}
                onChange={(e) => handleSettingChange('autoConfirm', e.target.checked)}
              />
              <label htmlFor="autoConfirm">Automatikus visszaigazolás</label>
              <small className="field-note">Bekapcsolásakor a foglalások automatikusan megerősítésre kerülnek manuális jóváhagyás nélkül.</small>
            </div>

            <div className="info-box">
              <span className="info-icon">ℹ️</span>
              <div className="info-content">
                <strong>Foglalási feltételek:</strong>
                <p>A lemondási határidőn belüli lemondás esetén a befizetett összeg 50%-át visszatartjuk.</p>
              </div>
            </div>
          </div>
        )}

        {/* Email értesítések */}
        {activeTab === 'email' && (
          <div className="settings-form">
            <h3>Email értesítések</h3>
            
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              />
              <label htmlFor="emailNotifications">Email értesítések engedélyezése</label>
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="bookingConfirmation"
                checked={settings.bookingConfirmation}
                onChange={(e) => handleSettingChange('bookingConfirmation', e.target.checked)}
                disabled={!settings.emailNotifications}
              />
              <label htmlFor="bookingConfirmation">Foglalási visszaigazolás küldése</label>
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="reminderEmails"
                checked={settings.reminderEmails}
                onChange={(e) => handleSettingChange('reminderEmails', e.target.checked)}
                disabled={!settings.emailNotifications}
              />
              <label htmlFor="reminderEmails">Emlékeztető email küldése (24 órával a túra előtt)</label>
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="marketingEmails"
                checked={settings.marketingEmails}
                onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
                disabled={!settings.emailNotifications}
              />
              <label htmlFor="marketingEmails">Marketing email-ek küldése (hírlevél, ajánlatok)</label>
            </div>

            <div className="email-templates">
              <h4>Email sablonok</h4>
              <div className="template-list">
                <button className="template-btn">Foglalási visszaigazolás</button>
                <button className="template-btn">Lemondási visszaigazolás</button>
                <button className="template-btn">Emlékeztető email</button>
                <button className="template-btn">Jelszó visszaállítás</button>
              </div>
            </div>
          </div>
        )}

        {/* Biztonsági beállítások */}
        {activeTab === 'security' && (
          <div className="settings-form">
            <h3>Jelszó módosítása</h3>
            
            <form onSubmit={handleChangePassword} className="password-form">
              <div className="form-group">
                <label htmlFor="current">Jelenlegi jelszó</label>
                <input
                  type="password"
                  id="current"
                  name="current"
                  value={passwordData.current}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="new">Új jelszó</label>
                <input
                  type="password"
                  id="new"
                  name="new"
                  value={passwordData.new}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
                <small className="field-note">Legalább 6 karakter hosszú.</small>
              </div>

              <div className="form-group">
                <label htmlFor="confirm">Új jelszó megerősítése</label>
                <input
                  type="password"
                  id="confirm"
                  name="confirm"
                  value={passwordData.confirm}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <button type="submit" className="change-password-btn">
                Jelszó módosítása
              </button>
            </form>

            <div className="security-divider"></div>

            <h3>Biztonsági beállítások</h3>
            
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="twoFactor"
                checked={settings.twoFactor || false}
                onChange={(e) => handleSettingChange('twoFactor', e.target.checked)}
              />
              <label htmlFor="twoFactor">Kétfaktoros hitelesítés (2FA) engedélyezése</label>
              <small className="field-note">Bejelentkezéshez emailben küldött kód is szükséges.</small>
            </div>

            <div className="form-group">
              <label htmlFor="sessionTimeout">Munkamenet időkorlát (perc)</label>
              <input
                type="number"
                id="sessionTimeout"
                min="5"
                max="480"
                value={settings.sessionTimeout || 120}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
              />
              <small className="field-note">Ennyi perc inaktivitás után automatikus kijelentkezés.</small>
            </div>

            <div className="login-history">
              <h4>Legutóbbi bejelentkezések</h4>
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Dátum</th>
                    <th>IP cím</th>
                    <th>Eszköz</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{new Date().toLocaleString('hu-HU')}</td>
                    <td>192.168.1.100</td>
                    <td>Chrome / Windows</td>
                  </tr>
                  <tr>
                    <td>{new Date(Date.now() - 86400000).toLocaleString('hu-HU')}</td>
                    <td>192.168.1.100</td>
                    <td>Chrome / Windows</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="settings-footer">
        <button className="save-btn" onClick={handleSaveSettings}>
          <span className="btn-icon">💾</span>
          Változtatások mentése
        </button>
        <button className="cancel-btn" onClick={() => window.location.reload()}>
          Mégse
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;