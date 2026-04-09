import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>GasztroKalandok</h3>
          <p>Magyarország vezető gasztrotúra szervezője. Fedezze fel a Kárpát-medence ízeit autentikus környezetben.</p>
        </div>
        
        <div className="footer-section">
          <h4>Gyors linkek</h4>
          <ul>
            <li><a href="/">Főoldal</a></li>
            <li><a href="/tours">Túrák</a></li>
            <li><a href="#about">Rólunk</a></li>
            <li><a href="#contact">Kapcsolat</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Elérhetőség</h4>
          <ul>
            <li>📞 +36 30 123 4567</li>
            <li>✉️ info@gasztrokalandok.hu</li>
            <li>📍 Budapest, Váci utca 20.</li>
          </ul>
        </div>
        
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 GasztroKalandok. Minden jog fenntartva.</p>
      </div>
    </footer>
  );
};

export default Footer;