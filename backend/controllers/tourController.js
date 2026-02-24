const db = require('../config/db');

exports.getAllTours = async (req, res) => {
  try {
    const [tours] = await db.query(`
      SELECT t.*, 
             (SELECT GROUP_CONCAT(destination_name) 
              FROM tour_destinations 
              WHERE tour_id = t.id) as destinations
      FROM tours t
      WHERE t.is_active = 1
      ORDER BY t.created_at DESC
    `);

    res.json(tours);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

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

exports.createTour = async (req, res) => {
  try {
    const { title, description, city, country, region, duration, price, image, max_participants, destinations, dates } = req.body;

    const [result] = await db.query(`
      INSERT INTO tours (title, description, city, country, region, duration, price, image, max_participants, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, description, city, country, region, duration, price, image, max_participants, req.user.id]);

    const tourId = result.insertId;

    if (destinations && destinations.length > 0) {
      for (const dest of destinations) {
        await db.query(
          'INSERT INTO tour_destinations (tour_id, destination_name) VALUES (?, ?)',
          [tourId, dest]
        );
      }
    }

    if (dates && dates.length > 0) {
      for (const date of dates) {
        await db.query(
          'INSERT INTO tour_dates (tour_id, start_date, end_date, available_spots) VALUES (?, ?, ?, ?)',
          [tourId, date.start_date, date.end_date || date.start_date, date.available_spots || max_participants]
        );
      }
    }

    res.status(201).json({ message: 'Túra létrehozva', id: tourId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, city, country, region, duration, price, image, max_participants, is_active } = req.body;

    await db.query(`
      UPDATE tours 
      SET title = ?, description = ?, city = ?, country = ?, region = ?, 
          duration = ?, price = ?, image = ?, max_participants = ?, is_active = ?
      WHERE id = ?
    `, [title, description, city, country, region, duration, price, image, max_participants, is_active, id]);

    res.json({ message: 'Túra frissítve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

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