export const regionsData = [
  {
    id: 'tokaj',
    name: 'Tokaj & Észak-Kelet',
    image: 'tokaj-wine.jpg',
    history: 'A világ első zárt borvidéke, vulkanikus talajjal és évszázados hagyományokkal.'
  },
  {
    id: 'balaton',
    name: 'Balaton-felvidék',
    image: 'tihany-food.jpg',
    history: 'A magyar Provence, ahol a lankák és a Balaton találkozása mediterrán hangulatot áraszt.'
  }
];

export const upcomingTours = [
  {
    id: 201,
    region: 'Catalonia',
    cim: 'Milk Street on the Road: Catalonia',
    leiras: 'Considering its small size, Catalonia has had a profound impact on the food world. From this bountiful territory nestled between Spain and France...',
    ar: '$7000',
    kep: 'catalonia.jpg',
    badges: [
      { text: 'May 2026', color: 'yellow' },
      { text: 'November 2026', color: 'red' }
    ]
  },
  {
    id: 202,
    region: 'Istanbul',
    cim: 'Milk Street on the Road: Istanbul',
    leiras: 'By the grace of geography, Istanbul sits astride one of the planet\'s most monumental crossroads, bridging Europe and Asia and connecting diverse cultures...',
    ar: '$6000',
    kep: 'istanbul.jpg',
    badges: [
      { text: 'May 2026', color: 'yellow' }
    ]
  }
];

// Az összes többi túra (szűrőkhöz)
export const toursData = [
  { id: 1, type: 'daily', region: 'budapest', varos: 'Budapest', cim: 'Nagypiac Séta', ar: '18 000 Ft', kep: 'budapest.jpg' },
  { id: 101, type: 'long', region: 'tokaj', varos: 'Tokaj', cim: 'Aszú Túra', ar: '145 000 Ft', kep: 'tokaj.jpg' }
];