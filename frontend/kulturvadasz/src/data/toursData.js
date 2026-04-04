// ============================================================================
// RÉGIÓK ADATAI (Főoldal mozaikhoz és szűrőkhöz)
// ============================================================================
export const regionsData = [
  { 
    id: 'tokaj', 
    name: 'Tokaj & Észak', 
    image: 'tokaj.jpg',
    history: 'A világ első zárt borvidéke, ahol a vulkanikus talaj és a folyók találkozása egyedülálló mikroklímát teremt az aszú számára.'
  },
  { 
    id: 'balaton', 
    name: 'Balaton-felvidék', 
    image: 'balaton-felvidek.jpg',
    history: 'A magyar Provence, ahol a lankák, a bazaltorgonák és a Balaton víztükre mediterrán hangulatot és kiváló borokat adnak.'
  },
  { 
    id: 'alfold', 
    name: 'Dél-Alföld & Puszta', 
    image: 'puszta-gulyas.jpg',
    history: 'A végtelen rónaság, a betyárvilág és a folyami halászat bölcsője. A magyar fűszerpaprika és a gulyás igazi hazája.'
  },
  { 
    id: 'budapest', 
    name: 'Budapest & Környéke', 
    image: 'budapest.jpg',
    history: 'A Monarchia korabeli kávéházak, a nyüzsgő piacok és a modern gasztronómia izgalmas találkozási pontja.'
  }
];

// ============================================================================
// TÚRÁK ADATAI (Érkező kalandok, Hosszú túrák, Városi séták)
// Típusok: 'upcoming' (Kiemelt/Érkező), 'long' (Többnapos), 'daily' (Egynapos/Városi)
// ============================================================================
export const toursData = [
  // --- UPCOMING / KIEMELT TÚRÁK (Felső sorok a dizájnban) ---
  {
    id: 1,
    type: 'upcoming',
    region: 'alfold',
    cim: 'Autentikus Puszta Gulyás Séta',
    sub: 'Hagyományőrző tanyasi lakoma',
    varos: 'Hortobágy',
    kep: 'puszta-gulyas.jpg',
    ar: '18 900 Ft'
  },
  {
    id: 2,
    type: 'upcoming',
    region: 'alfold',
    cim: 'Tanyasi Tej és Sajtmanufaktúra',
    sub: 'Kézműves sajtkóstoló a pusztán',
    varos: 'Kecskemét',
    kep: 'puszta-tej.jpg',
    ar: '14 500 Ft'
  },
  {
    id: 3,
    type: 'upcoming',
    region: 'tokaj',
    cim: 'Egri Bikavér és Pincetúra',
    sub: 'Pincesorok titkai Egerben',
    varos: 'Eger',
    kep: 'eger-wine.jpg',
    ar: '22 000 Ft'
  },
  {
    id: 4,
    type: 'upcoming',
    region: 'tokaj',
    cim: 'Tokaji Kastélyok és Borok',
    sub: 'Prémium dűlőtúra és borkóstoló',
    varos: 'Tokaj',
    kep: 'tokaj-kastely.jpg',
    ar: '35 000 Ft'
  },

  // --- LONG / TÖBBNAPOS TÚRÁK ---
  {
    id: 101,
    type: 'long',
    region: 'balaton',
    cim: 'Balaton-felvidéki Panoráma',
    sub: '3 napos gasztro-hétvége',
    varos: 'Badacsony',
    kep: 'balaton-felvidek.jpg',
    ar: '125 000 Ft'
  },
  {
    id: 102,
    type: 'long',
    region: 'tokaj',
    cim: 'Aszú Felfedező Hétvége',
    sub: 'Mélyedjen el a borok királyában',
    varos: 'Mád',
    kep: 'tokaj.jpg',
    ar: '98 000 Ft'
  },

  // --- DAILY / VÁROSI SÉTÁK (Alsó sorok a dizájnban) ---
  {
    id: 201,
    type: 'daily',
    region: 'budapest',
    cim: 'Békebeli Cukrászda Séta',
    sub: 'Sütemények és kávéházak',
    varos: 'Budapest',
    kep: 'budapest-cukraszda.jpg',
    ar: '12 500 Ft'
  },
  {
    id: 202,
    type: 'daily',
    region: 'budapest',
    cim: 'Nagyvásárcsarnok és Piac Séta',
    sub: 'Kóstoló a pultok között',
    varos: 'Budapest',
    kep: 'budapest-market.jpg',
    ar: '15 000 Ft'
  },
  {
    id: 203,
    type: 'daily',
    region: 'budapest',
    cim: 'Budapesti Klasszikusok',
    sub: 'Lángos, Gulyás és kürtőskalács',
    varos: 'Budapest',
    kep: 'budapest.jpg',
    ar: '18 000 Ft'
  },
  {
    id: 204,
    type: 'daily',
    region: 'tokaj',
    cim: 'Történelmi Pince Séta',
    sub: 'Városnézés és 3 tételes kóstoló',
    varos: 'Eger',
    kep: 'eger-wine.jpg', // Újrahasznált kép, amíg nincs több
    ar: '14 900 Ft'
  },
  {
    id: 205,
    type: 'daily',
    region: 'balaton',
    cim: 'Tihanyi Levendula és Halászlékóstoló',
    sub: 'Panorámás ebéd az apátság alatt',
    varos: 'Tihany',
    kep: 'balaton-felvidek.jpg', // Újrahasznált kép
    ar: '19 500 Ft'
  }
];