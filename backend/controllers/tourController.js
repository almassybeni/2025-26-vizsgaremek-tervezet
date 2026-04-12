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
      WHERE t.id = ? AND t.is_active = 1
    `, [id]);

    if (tours.length === 0) {
      return res.status(404).json({ message: 'Túra nem található' });
    }

    // Időpontok lekérése a foglaláshoz
    const [dates] = await db.query(
      'SELECT * FROM tour_dates WHERE tour_id = ? AND is_active = 1 ORDER BY start_date',
      [id]
    );

    const tour = tours[0];
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
      WHERE t.slug = ? AND t.is_active = 1
    `, [slug]);

    if (tours.length === 0) {
      return res.status(404).json({ message: 'Túra nem található' });
    }

    const tour = tours[0];
    const [dates] = await db.query(
      'SELECT * FROM tour_dates WHERE tour_id = ? AND is_active = 1 ORDER BY start_date',
      [tour.id]
    );
    
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
      meta_title, meta_description, slug, status
    } = req.body;

    if (slug) {
      const [existing] = await db.query('SELECT id FROM tours WHERE slug = ?', [slug]);
      if (existing.length > 0) {
        return res.status(400).json({ message: 'Már létezik ilyen URL azonosítójú túra' });
      }
    }

    const [result] = await db.query(`
      INSERT INTO tours (
        title, description, city, country, region, type, duration, 
        price, image, max_participants, created_by, 
        meta_title, meta_description, slug, is_active,
        highlights, included, not_included
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title, description, city, country, region, type || 'daily', duration, 
      price, image || 'placeholder.jpg', max_participants || 15, req.user.id,
      meta_title || title, meta_description || '', 
      slug || title.toLowerCase().replace(/\s+/g, '-'), 
      status === 'active' ? 1 : 0, // Itt is 1/0-ra fordítjuk a státuszt
      JSON.stringify(highlights || []),
      JSON.stringify(included || []),
      JSON.stringify(not_included || [])
    ]);

    const tourId = result.insertId;

    if (destinations && destinations.length > 0) {
      for (const dest of destinations) {
        if (dest?.trim()) {
          await db.query('INSERT INTO tour_destinations (tour_id, destination_name) VALUES (?, ?)', [tourId, dest.trim()]);
        }
      }
    }

    if (dates && dates.length > 0) {
      for (const date of dates) {
        if (date.start_date) {
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
      image, max_participants, status, meta_title, meta_description, slug,
      highlights, included, not_included
    } = req.body;

    await db.query(`
      UPDATE tours 
      SET title = ?, description = ?, city = ?, country = ?, region = ?, type = ?,
          duration = ?, price = ?, image = ?, max_participants = ?, 
          is_active = ?, meta_title = ?, meta_description = ?, slug = ?,
          highlights = ?, included = ?, not_included = ?
      WHERE id = ?
    `, [
      title, description, city, country, region, type, duration, price, 
      image, max_participants, status === 'active' ? 1 : 0, meta_title, meta_description, slug,
      JSON.stringify(highlights || []),
      JSON.stringify(included || []),
      JSON.stringify(not_included || []),
      id
    ]);

    res.json({ message: 'Túra frissítve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
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