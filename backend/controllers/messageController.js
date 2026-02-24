const db = require('../config/db');

exports.sendMessage = async (req, res) => {
  try {
    const { receiver_id, subject, message, type } = req.body;
    const sender_id = req.user.id;

    await db.query(`
      INSERT INTO messages (sender_id, receiver_id, subject, message, type)
      VALUES (?, ?, ?, ?, ?)
    `, [sender_id, receiver_id, subject, message, type || 'general']);

    res.status(201).json({ message: 'Üzenet elküldve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

exports.getInbox = async (req, res) => {
  try {
    const [messages] = await db.query(`
      SELECT m.*, u.name as sender_name, u.email as sender_email
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.receiver_id = ?
      ORDER BY m.created_at DESC
    `, [req.user.id]);

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

exports.getOutbox = async (req, res) => {
  try {
    const [messages] = await db.query(`
      SELECT m.*, u.name as receiver_name, u.email as receiver_email
      FROM messages m
      JOIN users u ON m.receiver_id = u.id
      WHERE m.sender_id = ?
      ORDER BY m.created_at DESC
    `, [req.user.id]);

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('UPDATE messages SET is_read = 1 WHERE id = ? AND receiver_id = ?', [id, req.user.id]);

    res.json({ message: 'Üzenet olvasottnak jelölve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};