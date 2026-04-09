import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './AboutPage.css';

const AboutPage = () => {
  const values = [
    {
      id: 1,
      icon: '🌍',
      title: 'Autentikus élmények',
      description: 'Csak olyan helyeket mutatunk meg, ahol mi magunk is szívesen járunk. A helyi ízek és hagyományok tisztelete vezérel minket.'
    },
    {
      id: 2,
      icon: '🤝',
      title: 'Helyi közösségek',
      description: 'Együttműködünk helyi termelőkkel, családi vállalkozásokkal, hogy a túráink valódi értéket teremtsenek.'
    },
    {
      id: 3,
      icon: '🌟',
      title: 'Minőségi szolgáltatás',
      description: 'Kiscsoportos túrák, személyre szabott figyelem, rugalmasság - nálunk a vendég az első.'
    },
    {
      id: 4,
      icon: '🌱',
      title: 'Fenntarthatóság',
      description: 'Törekszünk a környezettudatos működésre, csökkentjük a hulladékot és támogatjuk a fenntartható gasztronómiát.'
    }
  ];

  const partners = [
    { id: 1, name: 'Magyar Turisztikai Ügynökség', logo: '/images/partner-mtu.png' },
    { id: 2, name: 'Hungarikum Bizottság', logo: '/images/partner-hungarikum.png' },
    { id: 3, name: 'Magyar Bor Akadémia', logo: '/images/partner-bor.png' },
    { id: 4, name: 'Magyar Gasztronómiai Egyesület', logo: '/images/partner-gasztro.png' }
  ];

  return (
    <div className="about-page">
      <Header />
      
      <main>
        {/* Hero szekció */}
        <div className="about-hero">
          <div className="container">
            <h1>Rólunk</h1>
            <p className="subtitle">Ismerj meg minket közelebbről</p>
          </div>
        </div>

        {/* Történetünk szekció */}
        <section className="story-section">
          <div className="container">
            <div className="story-grid">
              <div className="story-content">
                <h2>Történetünk</h2>
                <p className="story-lead">
                  A GasztroKalandok 2015-ben született meg egy baráti beszélgetésből. 
                  Az alapítók közös szenvedélye a magyar gasztronómia és a vendégszeretet.
                </p>
                <p>
                  Célunk, hogy megismertessük a világgal a magyar konyha gazdagságát és 
                  sokszínűségét. Hiszünk abban, hogy az igazi élmények a helyi ízekben, 
                  a piacok forgatagában és a családi receptekben rejlenek.
                </p>
                <p>
                  Az évek során több ezer vendéget kalauzoltunk el Budapest, Eger, Szeged 
                  és más magyar városok legautentikusabb gasztronómiai helyszíneire. 
                  Büszkék vagyunk arra, hogy vendégeink nemcsak turisták, hanem visszatérő 
                  barátok lettek.
                </p>
                
                <div className="story-quote">
                  <blockquote>
                    "A legjobb módja egy ország megismerésének, ha az ízein keresztül fedezzük fel."
                  </blockquote>
                  <cite>- Kovács Péter, alapító</cite>
                </div>
              </div>
              
              <div className="story-image">
                <img src="/images/about-story.jpg" alt="GasztroKalandok történet" />
              </div>
            </div>
          </div>
        </section>

        
        {/* Értékeink */}
        <section className="values-section">
          <div className="container">
            <h2>Értékeink</h2>
            <p className="section-intro">
              Ezek az elvek vezérelnek minket mindennapi munkánk során
            </p>
            
            <div className="values-grid">
              {values.map(value => (
                <div key={value.id} className="value-card">
                  <div className="value-icon">{value.icon}</div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partnerek */}
        <section className="partners-section">
          <div className="container">
            <h2>Partnereink</h2>
            <p className="section-intro">
              Akikkel büszkék vagyunk együtt dolgozni
            </p>
            
            <div className="partners-grid">
              {partners.map(partner => (
                <div key={partner.id} className="partner-item">
                  <img src={partner.logo} alt={partner.name} />
                  <p>{partner.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA szekció */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Csatlakozz hozzánk!</h2>
              <p>
                Fedezd fel te is a magyar gasztronómia csodáit. 
                Válassz egy túrát, és indulj el egy felejthetetlen kalandra!
              </p>
              <button 
                className="cta-button"
                onClick={() => window.location.href = '/tours'}
              >
                Túráink megtekintése
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;