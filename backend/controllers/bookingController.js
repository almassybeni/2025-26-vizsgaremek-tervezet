const db = require('../config/db');

exports.createBooking = async (req, res) => {
  try {
    const { tour_id, tour_date, participants_count, special_requests, total_price } = req.body;
    const user_id = req.user.id;

    const [tours] = await db.query('SELECT title FROM tours WHERE id = ?', [tour_id]);
    
    if (tours.length === 0) {
      return res.status(404).json({ message: 'Túra nem található' });
    }

    const [result] = await db.query(`
      INSERT INTO bookings (user_id, tour_id, tour_date, participants_count, total_price, special_requests, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `, [user_id, tour_id, tour_date, participants_count, total_price, special_requests || null]);

    res.status(201).json({ 
      message: 'Foglalás sikeres', 
      booking_id: result.insertId 
    });
  } catch (error) {
    console.error('Foglalási hiba:', error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [bookings] = await db.query(`
      SELECT 
        b.*, 
        t.title, 
        t.city, 
        t.country, 
        t.image,
        t.duration
      FROM bookings b
      JOIN tours t ON b.tour_id = t.id
      WHERE b.user_id = ? AND b.status != 'cancelled'
      ORDER BY b.created_at DESC
    `, [user_id]);

    res.json(bookings);
  } catch (error) {
    console.error('Foglalások lekérési hiba:', error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const [bookings] = await db.query(`
      SELECT 
        b.*, 
        t.title, 
        t.city, 
        t.country, 
        t.image,
        t.duration,
        t.description as tour_description
      FROM bookings b
      JOIN tours t ON b.tour_id = t.id
      WHERE b.id = ? AND b.user_id = ?
    `, [id, user_id]);

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Foglalás nem található' });
    }

    res.json(bookings[0]);
  } catch (error) {
    console.error('Foglalás lekérési hiba:', error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const [bookings] = await db.query(
      'SELECT * FROM bookings WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Foglalás nem található' });
    }

    const booking = bookings[0];

    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return res.status(400).json({ 
        message: 'Csak függőben lévő vagy megerősített foglalást lehet lemondani' 
      });
    }

    await db.query(
      'UPDATE bookings SET status = "cancelled" WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    res.json({ message: 'Foglalás sikeresen lemondva' });
  } catch (error) {
    console.error('Lemondási hiba:', error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT 
        b.*, 
        t.title, 
        u.name as user_name, 
        u.email as user_email
      FROM bookings b
      JOIN tours t ON b.tour_id = t.id
      JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
    `);

    res.json(bookings);
  } catch (error) {
    console.error('Foglalások lekérési hiba:', error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Érvénytelen státusz' });
    }

    await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);

    res.json({ message: 'Foglalás státusz frissítve' });
  } catch (error) {
    console.error('Státusz módosítási hiba:', error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};