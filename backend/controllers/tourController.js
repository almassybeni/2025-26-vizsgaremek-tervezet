const db = require('../config/db');

console.log('✅ tourController betöltve');

// --- ÖSSZES TÚRA LEKÉRÉSE (Szűréssel kiegészítve) ---
exports.getAllTours = async (req, res) => {
  try {
    const { region } = req.query; // Kiolvassuk a ?region= paramétert az URL-ből
    
    let sql = `
      SELECT t.*, 
             (SELECT GROUP_CONCAT(destination_name) 
              FROM tour_destinations 
              WHERE tour_id = t.id) as destinations
      FROM tours t
      WHERE t.is_active = 1
    `;
    const params = [];

    // Ha van megadva régió, és az nem 'osszes'
    if (region && region !== 'osszes') {
      sql += " AND (t.region = ? OR t.city = ?)";
      params.push(region, region);
    }

    sql += " ORDER BY t.created_at DESC";
    
    const [tours] = await db.query(sql, params);

    // JSON mezők visszaalakítása minden túránál a listában
    tours.forEach(tour => {
      ['highlights', 'included', 'not_included'].forEach(field => {
        if (tour[field] && typeof tour[field] === 'string') {
          try { tour[field] = JSON.parse(tour[field]); } catch (e) { tour[field] = []; }
        }
      });
    });

    res.json(tours);
  } catch (error) {
    console.error('Hiba a túrák lekérésekor:', error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

// --- EGY TÚRA LEKÉRÉSE ID ALAPJÁN (Adatlaphoz) ---
exports.getTourById = async (req, res) => {
  try {
    const { id } = req.params;

    const [tours] = await db.query(`
      SELECT t.*, 
             (SELECT GROUP_CONCAT(destination_name) 
              FROM tour_destinations 
              WHERE tour_id = t.id) as destinations
      FROM tours t
      WHERE t.id = ?
    `, [id]);

    if (tours.length === 0) {
      return res.status(404).json({ message: 'Túra nem található' });
    }

    // Időpontok lekérése a foglaláshoz
    const tour = tours[0];

    // JSON mezők visszaalakítása tömbbé
    ['highlights', 'included', 'not_included'].forEach(field => {
      if (tour[field] && typeof tour[field] === 'string') {
        try { tour[field] = JSON.parse(tour[field]); } catch (e) { tour[field] = []; }
      }
    });

    const [dates] = await db.query(
      'SELECT * FROM tour_dates WHERE tour_id = ? ORDER BY start_date',
      [tour.id]
    );

    tour.dates = dates;

    res.json(tour);
  } catch (error) {
    console.error('Hiba a túra lekérésekor:', error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

// --- TÚRA LEKÉRÉSE SLUG ALAPJÁN ---
exports.getTourBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const [tours] = await db.query(`
      SELECT t.*, 
             (SELECT GROUP_CONCAT(destination_name) 
              FROM tour_destinations 
              WHERE tour_id = t.id) as destinations
      FROM tours t
      WHERE t.title = ?
    `, [slug.replace(/-/g, ' ')]); // Ideiglenes fix: cím alapján keresünk, ha nincs slug oszlop

    if (tours.length === 0) {
      return res.status(404).json({ message: 'Túra nem található' });
    }

    const tour = tours[0];
    const [dates] = await db.query(
      'SELECT * FROM tour_dates WHERE tour_id = ? ORDER BY start_date',
      [tour.id]
    );
    
    ['highlights', 'included', 'not_included'].forEach(field => {
      if (tour[field] && typeof tour[field] === 'string') {
        try { tour[field] = JSON.parse(tour[field]); } catch (e) { tour[field] = []; }
      }
    });

    tour.dates = dates;
    res.json(tour);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

// --- ÚJ TÚRA LÉTREHOZÁSA ---
exports.createTour = async (req, res) => {
  try {
    const { 
      title, description, city, country, region, type,
      duration, price, image, max_participants,
      destinations, dates, highlights, included, not_included,
      meta_title, meta_description, status
    } = req.body;

    // Biztonsági ellenőrzés: ha nincs bejelentkezett felhasználó, nem tudunk rögzíteni
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Hitelesítés szükséges a túra létrehozásához' });
    }

    // Ár tisztítása (csak szám maradjon)
    const cleanPrice = typeof price === 'string' ? parseInt(price.replace(/[^0-9]/g, ''), 10) : price;

    // Ha a státusz nincs megadva, alapértelmezetten aktív (1)
    const isActive = status === 'inactive' ? 0 : 1;

    const [result] = await db.query(`
      INSERT INTO tours (
        title, description, city, country, region, type, duration, 
        price, image, max_participants, created_by, 
        meta_title, meta_description, is_active,
        highlights, included, not_included
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title, description, city, country, region, type || 'daily', duration, 
      cleanPrice || 0, image || 'placeholder.jpg', max_participants || 15, req.user.id,
      meta_title || title, meta_description || '',
      isActive,
      JSON.stringify(Array.isArray(highlights) ? highlights : (highlights ? highlights.split(',').map(s => s.trim()) : [])),
      JSON.stringify(Array.isArray(included) ? included : (included ? included.split(',').map(s => s.trim()) : [])),
      JSON.stringify(Array.isArray(not_included) ? not_included : (not_included ? not_included.split(',').map(s => s.trim()) : []))
    ]);

    const tourId = result.insertId;

    // Destinations kezelése
    const parsedDestinations = Array.isArray(destinations) ? destinations : (destinations ? destinations.split(',').map(s => s.trim()) : []);
    if (parsedDestinations.length > 0) {
      for (const dest of parsedDestinations) {
        if (dest) { // Ellenőrizzük, hogy a dest nem üres string
          await db.query('INSERT INTO tour_destinations (tour_id, destination_name) VALUES (?, ?)', [tourId, dest]);
        }
      }
    }

    // Dátumok kezelése
    // Feltételezzük, hogy a dates egy objektumtömb, ahol minden objektum tartalmazza a start_date-et
    const parsedDates = Array.isArray(dates) ? dates : [];
    if (parsedDates.length > 0) {
      for (const date of parsedDates) {
        if (date && date.start_date) {
          await db.query('INSERT INTO tour_dates (tour_id, start_date, end_date, available_spots) VALUES (?, ?, ?, ?)', 
          [tourId, date.start_date, date.end_date || date.start_date, date.available_spots || max_participants]);
        }
      }
    }

    res.status(201).json({ message: 'Túra sikeresen létrehozva', id: tourId });
  } catch (error) {
    console.error('Hiba a létrehozáskor:', error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

// --- TÚRA MÓDOSÍTÁSA ---
exports.updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, city, country, region, type, duration, price,
      image, max_participants, status, meta_title, meta_description,
      highlights, included, not_included,
      destinations, dates
    } = req.body;

    const cleanPrice = typeof price === 'string' ? parseInt(price.replace(/[^0-9]/g, ''), 10) : price;
    const cleanMaxParticipants = typeof max_participants === 'string' ? parseInt(max_participants, 10) : max_participants;
    const isActive = status === 'inactive' ? 0 : 1;

    await db.query(`
      UPDATE tours 
      SET title = ?, description = ?, city = ?, country = ?, region = ?, type = ?,
          duration = ?, price = ?, image = ?, max_participants = ?,
          is_active = ?, meta_title = ?, meta_description = ?,
          highlights = ?, included = ?, not_included = ?
      WHERE id = ?
    `, [
      title, description, city, country, region, type || 'daily', duration,
      cleanPrice || 0, image || 'placeholder.jpg', cleanMaxParticipants || 15,
      isActive, meta_title || title, meta_description || '',
      JSON.stringify(Array.isArray(highlights) ? highlights : (highlights ? highlights.split(',').map(s => s.trim()) : [])),
      JSON.stringify(Array.isArray(included) ? included : (included ? included.split(',').map(s => s.trim()) : [])),
      JSON.stringify(Array.isArray(not_included) ? not_included : (not_included ? not_included.split(',').map(s => s.trim()) : [])),
      id
    ]);

    // --- Update Destinations ---
    await db.query('DELETE FROM tour_destinations WHERE tour_id = ?', [id]);
    const parsedDestinations = Array.isArray(destinations) ? destinations : (destinations ? destinations.split(',').map(s => s.trim()) : []);
    if (parsedDestinations.length > 0) {
      for (const dest of parsedDestinations) {
        if (dest) {
          await db.query('INSERT INTO tour_destinations (tour_id, destination_name) VALUES (?, ?)', [id, dest]);
        }
      }
    }

    // --- Update Dates ---
    await db.query('DELETE FROM tour_dates WHERE tour_id = ?', [id]);
    const parsedDates = Array.isArray(dates) ? dates : [];
    if (parsedDates.length > 0) {
      for (const date of parsedDates) {
        if (date && date.start_date) {
          await db.query('INSERT INTO tour_dates (tour_id, start_date, end_date, available_spots) VALUES (?, ?, ?, ?)',
          [id, date.start_date, date.end_date || date.start_date, date.available_spots || cleanMaxParticipants]);
        }
      }
    }

    res.json({ message: 'Túra sikeresen frissítve' });
  } catch (error) {
    console.error('Hiba a túra módosításakor:', error);
    res.status(500).json({ message: 'Szerver hiba a túra módosításakor.' });
  }
};

// --- TÚRA TÖRLÉSE ---
exports.deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE tours SET is_active = 0 WHERE id = ?', [id]);
    res.json({ message: 'Túra törölve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};