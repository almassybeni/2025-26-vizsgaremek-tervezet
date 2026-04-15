const db = require('../config/db');

// Új foglalás létrehozása
exports.createBooking = async (req, res) => {
  try {
    const { tour_id, tour_date, participants_count, total_price, special_requests } = req.body;
    const user_id = req.user.id;

    const [result] = await db.query(
      `INSERT INTO bookings (user_id, tour_id, tour_date, participants_count, total_price, special_requests, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [user_id, tour_id, tour_date, participants_count, total_price, special_requests]
    );

    res.status(201).json({ message: 'Foglalás sikeresen létrehozva', bookingId: result.insertId });
  } catch (error) {
    console.error('Hiba a foglalásnál:', error);
    res.status(500).json({ message: 'Szerver hiba a foglalás során' });
  }
};

// Felhasználó saját foglalásainak lekérése
exports.getUserBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT b.*, t.title as tour_title, t.image as tour_image, t.city as tour_city
      FROM bookings b
      JOIN tours t ON b.tour_id = t.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [req.user.id]);
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

// Egy konkrét foglalás lekérése ID alapján
exports.getBookingById = async (req, res) => {
  try {
    const [booking] = await db.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (booking.length === 0) return res.status(404).json({ message: 'Foglalás nem található' });
    res.json(booking[0]);
  } catch (error) {
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

// Foglalás lemondása a felhasználó által
exports.cancelBooking = async (req, res) => {
  try {
    await db.query('UPDATE bookings SET status = "cancelled" WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Foglalás lemondva' });
  } catch (error) {
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

// Összes foglalás lekérése (Admin számára)
exports.getAllBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT 
        b.*, 
        u.name as user_name, 
        u.email as user_email, 
        t.title as tour_title 
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN tours t ON b.tour_id = t.id
      ORDER BY b.created_at DESC
    `);
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

// Foglalás státuszának frissítése
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Státusz frissítve' });
  } catch (error) {
    res.status(500).json({ message: 'Szerver hiba' });
  }
};