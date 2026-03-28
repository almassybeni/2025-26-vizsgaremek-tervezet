const db = require('../config/db');

console.log('✅ tourController betöltve');

// Összes túra lekérése
exports.getAllTours = async (req, res) => {
  try {
    const [tours] = await db.query(`
      SELECT t.*, 
             (SELECT GROUP_CONCAT(destination_name) 
              FROM tour_destinations 
              WHERE tour_id = t.id) as destinations
      FROM tours t
      WHERE t.status = 'active'
      ORDER BY t.created_at DESC
    `);

    res.json(tours);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

// Egy túra lekérése ID alapján
exports.getTourById = async (req, res) => {
  try {
    const { id } = req.params;

    const [tours] = await db.query(`
      SELECT t.*, 
             (SELECT GROUP_CONCAT(destination_name) 
              FROM tour_destinations 
              WHERE tour_id = t.id) as destinations
      FROM tours t
      WHERE t.id = ? AND t.status = 'active'
    `, [id]);

    if (tours.length === 0) {
      return res.status(404).json({ message: 'Túra nem található' });
    }

    // Időpontok lekérése
    const [dates] = await db.query(
      'SELECT * FROM tour_dates WHERE tour_id = ? AND is_active = 1 ORDER BY start_date',
      [id]
    );

    const tour = tours[0];
    tour.dates = dates;

    res.json(tour);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

// Túra lekérése slug alapján (előnézethez)
exports.getTourBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const [tours] = await db.query(`
      SELECT t.*, 
             (SELECT GROUP_CONCAT(destination_name) 
              FROM tour_destinations 
              WHERE tour_id = t.id) as destinations
      FROM tours t
      WHERE t.slug = ?
    `, [slug]);

    if (tours.length === 0) {
      return res.status(404).json({ message: 'Túra nem található' });
    }

    const tour = tours[0];
    
    // Időpontok lekérése
    const [dates] = await db.query(
      'SELECT * FROM tour_dates WHERE tour_id = ? ORDER BY start_date',
      [tour.id]
    );
    
    tour.dates = dates;

    res.json(tour);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

// Új túra létrehozása (TELJESEN JAVÍTVA)
exports.createTour = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      city, 
      country, 
      region, 
      duration, 
      price, 
      image, 
      max_participants,
      destinations,
      dates,
      highlights,
      included,
      not_included,
      meta_title,
      meta_description,
      slug,
      status
    } = req.body;

    // Ellenőrizzük, hogy van-e már ilyen slug
    if (slug) {
      const [existing] = await db.query(
        'SELECT id FROM tours WHERE slug = ?',
        [slug]
      );
      if (existing.length > 0) {
        return res.status(400).json({ 
          message: 'Már létezik ilyen URL azonosítójú túra' 
        });
      }
    }

    // Túra beszúrása
    const [result] = await db.query(`
      INSERT INTO tours (
        title, description, city, country, region, duration, 
        price, image, max_participants, created_by, 
        meta_title, meta_description, slug, status,
        highlights, included, not_included
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title, 
      description, 
      city, 
      country, 
      region, 
      duration, 
      price, 
      image || 'placeholder.jpg', 
      max_participants || 15, 
      req.user.id,
      meta_title || title,
      meta_description || (description ? description.substring(0, 160) : ''),
      slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      status || 'draft',
      JSON.stringify(highlights || []),
      JSON.stringify(included || []),
      JSON.stringify(not_included || [])
    ]);

    const tourId = result.insertId;

    // Célpontok beszúrása
    if (destinations && destinations.length > 0) {
      for (const dest of destinations) {
        if (dest && dest.trim()) {
          await db.query(
            'INSERT INTO tour_destinations (tour_id, destination_name) VALUES (?, ?)',
            [tourId, dest.trim()]
          );
        }
      }
    }

    // Időpontok beszúrása
    if (dates && dates.length > 0) {
      for (const date of dates) {
        if (date.start_date) {
          await db.query(
            'INSERT INTO tour_dates (tour_id, start_date, end_date, available_spots) VALUES (?, ?, ?, ?)',
            [tourId, date.start_date, date.end_date || date.start_date, date.available_spots || max_participants]
          );
        }
      }
    }

    res.status(201).json({
      message: 'Túra sikeresen létrehozva',
      id: tourId,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    });

  } catch (error) {
    console.error('Hiba a túra létrehozásakor:', error);
    res.status(500).json({ 
      message: 'Szerver hiba a túra létrehozása során',
      error: error.message 
    });
  }
};

// Túra módosítása (csak admin) (TELJESEN JAVÍTVA)
exports.updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, description, city, country, region, duration, price, 
      image, max_participants, status, meta_title, meta_description, slug,
      highlights, included, not_included
    } = req.body;

    // Ellenőrizzük, hogy a slug egyedi-e (kivéve saját magát)
    if (slug) {
      const [existing] = await db.query(
        'SELECT id FROM tours WHERE slug = ? AND id != ?',
        [slug, id]
      );
      if (existing.length > 0) {
        return res.status(400).json({ 
          message: 'Már létezik ilyen URL azonosítójú túra' 
        });
      }
    }

    await db.query(`
      UPDATE tours 
      SET title = ?, description = ?, city = ?, country = ?, region = ?, 
          duration = ?, price = ?, image = ?, max_participants = ?, 
          status = ?, meta_title = ?, meta_description = ?, slug = ?,
          highlights = ?, included = ?, not_included = ?
      WHERE id = ?
    `, [
      title, description, city, country, region, duration, price, 
      image, max_participants, status, meta_title, meta_description, slug,
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

// Túra törlése (csak admin)
exports.deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete - inaktív státuszba rakjuk
    await db.query('UPDATE tours SET status = "inactive" WHERE id = ?', [id]);

    res.json({ message: 'Túra törölve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};