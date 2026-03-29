// 1. RÉGIÓK ADATAI (Település/Régió felfedezőhöz)
export const regionsData = [
  {
    id: 'tokaj',
    name: 'Tokaj & Észak-Kelet',
    image: 'tokaj-wine.jpg',
    history: 'A világ első zárt borvidéke, ahol a vulkanikus talaj és a Tisza-Bodrog találkozása egyedülálló mikroklímát teremt.',
    foods: 'Tokaji Aszú, Zempléni vadhúsok, Görömbölyi kocsonya, Tokaji borkrémleves.',
    activities: ['Dűlőtúra terepjáróval', '6 puttonyos aszú kóstoló', 'Sajtműhely látogatás', 'Zempléni várnéző']
  },
  {
    id: 'balaton',
    name: 'Balaton-felvidék',
    image: 'tihany-food.jpg',
    history: 'A magyar Provence-ként emlegetett táj, ahol a tanúhegyek lábánál római kori alapokra épült borkultúra virágzik.',
    foods: 'Tihanyi levendulás sütik, Tapolcai pisztráng, Dörgicsei csirkecombok.',
    activities: ['Vitorlázás borkóstolóval', 'Levendula lepárló látogatás', 'Piacozás Káptalantótiban']
  },
  {
    id: 'alfold',
    name: 'Dél-Alföld & Puszta',
    image: 'szeged-fishsoup.jpg',
    history: 'A végtelen rónaság, a betyárvilág és a folyami halászat bölcsője. Itt a vendégszeretet az asztalnál kezdődik.',
    foods: 'Szegedi halászlé, bajai gyufatészta, gyulai kolbász, karcagi birkapörkölt.',
    activities: ['Pusztakocsikázás', 'Bográcsos főzőkurzus', 'Termálfürdőzés']
  }
];

// 2. EGYNAPOS TÚRÁK (A te eredeti listád + kiegészítve)
export const dailyTours = [
  {
    id: 1,
    type: 'daily',
    varos: "Budapest",
    orszag: "Magyarország",
    cim: "Nagypiac & Belvárosi Ízek",
    leiras: "Fedezze fel a budapesti Nagypiacot és a belváros rejtett kulináris kincseit.",
    kep: "budapest-market.jpg",
    idotartam: "6 óra",
    ar: "18 990 Ft"
  },
  {
    id: 2,
    type: 'daily',
    varos: "Eger",
    orszag: "Magyarország",
    cim: "Egri Borkultúra",
    leiras: "Ismerje meg az egri borvidék hagyományait és látogasson el történelmi pincékbe.",
    kep: "eger-wine.jpg",
    idotartam: "8 óra",
    ar: "24 990 Ft"
  },
  {
    id: 3,
    type: 'daily',
    varos: "Szeged",
    orszag: "Magyarország",
    cim: "Szegedi Halászlé",
    leiras: "A szegedi halászlé főzésének titkait ismerheti meg a Tisza-parton.",
    kep: "szeged-fishsoup.jpg",
    idotartam: "5 óra",
    ar: "15 990 Ft"
  }
];

// 3. HOSSZÚ TÚRÁK (Többnapos utak)
export const longTours = [
  {
    id: 101,
    type: 'long',
    cim: 'Észak-Magyarországi Bor- és Kastélytúra',
    varos: 'Tokaj - Eger - Lillafüred',
    orszag: 'Magyarország',
    idotartam: '4 nap / 3 éjszaka',
    ar: '145 000 Ft',
    kep: 'tokaj-kastely.jpg',
    leiras: 'Barangolás a magyar bor bölcsőjében. Szállás barokk kastélyszállókban, dűlőtúrák és privát aszú kóstolók.'
  },
  {
    id: 102,
    type: 'long',
    cim: 'Balaton-felvidéki Mediterrán Hétvége',
    varos: 'Badacsony - Tihany - Köveskál',
    orszag: 'Magyarország',
    idotartam: '3 nap / 2 éjszaka',
    ar: '98 000 Ft',
    kep: 'balaton-felvidek.jpg',
    leiras: 'A magyar Provence felfedezése. Piaclátogatás, sajt- és borkóstolók a Káli-medencében.'
  }
];

// 4. ÖSSZESÍTETT EXPORT
export const toursData = [...dailyTours, ...longTours];