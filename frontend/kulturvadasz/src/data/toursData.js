// RÉGIÓK ADATAI
export const regionsData = [
  {
    id: 'tokaj',
    name: 'Tokaj & Észak-Kelet',
    image: 'tokaj-wine.jpg',
    history: 'A világ első zárt borvidéke, ahol a vulkanikus talaj és a Tisza-Bodrog találkozása egyedülálló mikroklímát teremt. A vidék évszázadok óta a "királyok bora, a borok királya" hazája, ahol a pincerendszerek mélyén nemes penész őrzi az aszúszemek titkát.'
  },
  {
    id: 'balaton',
    name: 'Balaton-felvidék',
    image: 'tihany-food.jpg',
    history: 'A magyar Provence-ként emlegetett táj, ahol a tanúhegyek lábánál római kori alapokra épült borkultúra virágzik. A bazaltorgonák és a csillogó víztükör találkozása nemcsak látványban, de ízekben is különleges karaktert kölcsönöz a vidéknek.'
  },
  {
    id: 'alfold',
    name: 'Dél-Alföld & Puszta',
    image: 'szeged-fishsoup.jpg',
    history: 'A végtelen rónaság, a betyárvilág és a folyami halászat bölcsője. Itt alakult ki a magyar fűszerpaprika kultusza, és itt őrizték meg legtovább a pásztorélet ősi hagyományait, amelyek a mai napig meghatározzák a régió gasztronómiai identitását.'
  }
];

// EGYNAPOS TÚRÁK (10 DARAB)
export const dailyTours = [
  { id: 1, type: 'daily', region: 'budapest', varos: 'Budapest', cim: 'A Monarchia Ízei: Cukrászda Séta', ar: '16 500 Ft', kep: 'budapest-cukraszda.jpg', leiras: 'Békebeli hangulat és kézműves sütemények.' },
  { id: 2, type: 'daily', region: 'tokaj', varos: 'Eger', cim: 'Egri Várvédők Lakomája', ar: '21 000 Ft', kep: 'eger-gasztro.jpg', leiras: 'Történelmi séta és palóc ebéd.' },
  { id: 3, type: 'daily', region: 'alfold', varos: 'Szeged', cim: 'Halászlé és Paprika Túra', ar: '18 900 Ft', kep: 'szeged-halaszle.jpg', leiras: 'A Tisza-parti gasztronómia titkai.' },
  { id: 4, type: 'daily', region: 'balaton', varos: 'Pécs', cim: 'Mediterrán Séta & Borkóstoló', ar: '19 500 Ft', kep: 'pecs-seta.jpg', leiras: 'Zsolnay negyed és villányi vörösborok.' },
  { id: 5, type: 'daily', region: 'alfold', varos: 'Debrecen', cim: 'Debreceni Páros és Református Ízek', ar: '15 000 Ft', kep: 'debrecen-gasztro.jpg', leiras: 'A Cívis város öröksége.' },
  { id: 6, type: 'daily', region: 'budapest', varos: 'Szentendre', cim: 'Művészvilág és Szerb Falatok', ar: '22 500 Ft', kep: 'szentendre-duna.jpg', leiras: 'Galériák és balkáni ízek.' },
  { id: 7, type: 'daily', region: 'balaton', varos: 'Tihany', cim: 'Levendula és Balatoni Halak', ar: '24 000 Ft', kep: 'tihany-balaton.jpg', leiras: 'Panorámás terasz és friss süllő.' },
  { id: 8, type: 'daily', region: 'tokaj', varos: 'Sopron', cim: 'Kékfrankos és Ponciáter Ebéd', ar: '20 500 Ft', kep: 'sopron-bor.jpg', leiras: 'Borkóstoló egy polgári ház pincéjében.' },
  { id: 9, type: 'daily', region: 'balaton', varos: 'Kőszeg', cim: 'Gyógynövény és Csokoládé', ar: '14 500 Ft', kep: 'koszeg-foter.jpg', leiras: 'Az Alpokalja ékköve.' },
  { id: 10, type: 'daily', region: 'alfold', varos: 'Hortobágy', cim: 'Hortobágyi Puszta-Party', ar: '26 000 Ft', kep: 'hortobagy-puszta.jpg', leiras: 'Szekerezés és pásztorételek.' }
];

// HOSSZÚ TÚRÁK (10 DARAB)
export const longTours = [
  { id: 101, type: 'long', region: 'tokaj', varos: 'Tokaj-Eger', cim: 'Bor- és Kastélytúra', ar: '145 000 Ft', kep: 'tokaj-kastely.jpg', leiras: '4 napos prémium utazás.' },
  { id: 102, type: 'long', region: 'balaton', varos: 'Badacsony-Tihany', cim: 'Mediterrán Hétvége', ar: '98 000 Ft', kep: 'balaton-felvidek.jpg', leiras: '3 nap a magyar Provence-ban.' },
  { id: 103, type: 'long', region: 'alfold', varos: 'Szeged-Gyula', cim: 'Dél-Alföldi Expedíció', ar: '165 000 Ft', kep: 'alfold-gasztro.jpg', leiras: 'Húskészítmények és hungarikumok.' },
  { id: 104, type: 'long', region: 'balaton', varos: 'Őrség', cim: 'Kézműves Kalandozás', ar: '112 000 Ft', kep: 'orseg-tanya.jpg', leiras: 'Tökmagolaj és fazekas műhelyek.' },
  { id: 105, type: 'long', region: 'balaton', varos: 'Veszprém', cim: 'Dunántúli Királyi Lakoma', ar: '89 000 Ft', kep: 'veszprem-var.jpg', leiras: 'Középkori receptek modern köntösben.' },
  { id: 106, type: 'long', region: 'balaton', varos: 'Villány', cim: 'Vörösbor és Siklósi Napfény', ar: '125 000 Ft', kep: 'villany-pincesor.jpg', leiras: 'A legtestesebb borok vidéke.' },
  { id: 107, type: 'long', region: 'tokaj', varos: 'Erdély', cim: 'Hargita Kincsei', ar: '210 000 Ft', kep: 'erdely-hegyek.jpg', leiras: 'Székely konyha és vendégszeretet.' },
  { id: 108, type: 'long', region: 'tokaj', varos: 'Zemplén', cim: 'Vadon és Kastélyszállók', ar: '138 000 Ft', kep: 'zemplen-erdo.jpg', leiras: 'Vadhúsok és hercegi luxus.' },
  { id: 109, type: 'long', region: 'balaton', varos: 'Pannonhalma', cim: 'Szerzetesek Asztalánál', ar: '95 000 Ft', kep: 'pannonhalma-apatsag.jpg', leiras: 'Apátsági csokoládé és sörfőzde.' },
  { id: 110, type: 'long', region: 'budapest', varos: 'Országos', cim: 'A Nagy Gasztro-Körutazás', ar: '290 000 Ft', kep: 'hungary-map.jpg', leiras: 'Magyarország legjava 7 nap alatt.' }
];

export const toursData = [...dailyTours, ...longTours];