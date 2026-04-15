const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const [userCount] = await db.query('SELECT COUNT(*) as total FROM users');
    const [tourCount] = await db.query('SELECT COUNT(*) as total FROM tours');
    const [bookingCount] = await db.query('SELECT COUNT(*) as total FROM bookings');
    const [revenue] = await db.query('SELECT SUM(total_price) as total FROM bookings WHERE status != "cancelled"');
    
    const [recentBookings] = await db.query(`
      SELECT b.id, u.name as user_name, t.title as tour_title, b.status, b.created_at
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN tours t ON b.tour_id = t.id
      ORDER BY b.created_at DESC LIMIT 5
    `);

    res.json({
      totalUsers: userCount[0].total,
      totalTours: tourCount[0].total,
      totalBookings: bookingCount[0].total,
      totalRevenue: revenue[0].total || 0,
      recentBookings: recentBookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hiba a statisztikák lekérésekor' });
  }
};