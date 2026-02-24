import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">Fedezze Fel Magyarország Gasztro Kincseit</h1>
        <p className="hero-subtitle">
          GasztroKalandok - autentikus magyar gasztrotúrák, helyi ízek és kulináris élmények 
          Magyarországon és a szomszédos országokban.
        </p>
        <button className="hero-btn" onClick={() => navigate('/tours')}>
          Túrák Felfedezése
        </button>
      </div>
    </section>
  );
};

export default Hero;