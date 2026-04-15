const db = require('../config/db');

exports.sendMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    // Ha van token (auth middleware), mentsük el a küldő ID-ját
    const sender_id = req.user ? req.user.id : null;
    // Alapértelmezetten az adminnak (id: 1) küldjük a kapcsolatfelvételi üzeneteket
    const receiver_id = 1; 
    
    if (!message || !subject || (!sender_id && (!name || !email))) {
      return res.status(400).json({ message: 'Kérjük töltsön ki minden kötelező mezőt!' });
    }

    await db.query(
      'INSERT INTO messages (sender_id, receiver_id, name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [sender_id, receiver_id, name || null, email || null, phone || null, subject, message]
    );

    res.status(201).json({ success: true, message: 'Üzenet sikeresen elküldve!' });
  } catch (error) {
    console.error('Hiba az üzenet küldésekor:', error);
    res.status(500).json({ message: 'Szerver hiba történt az üzenet mentésekor.' });
  }
};

// Beérkező üzenetek lekérése (például az admin számára)
exports.getInbox = async (req, res) => {
  try {
    const userId = req.user.id;
    // LEFT JOIN-t használunk, hogy a vendég (sender_id IS NULL) üzenetek is megjelenjenek
    const [messages] = await db.query(`
      SELECT m.*, 
             COALESCE(u.name, m.name) as display_name, 
             COALESCE(u.email, m.email) as display_email
      FROM messages m
      LEFT JOIN users u ON m.sender_id = u.id
      WHERE m.receiver_id = ?
      ORDER BY m.created_at DESC
    `, [userId]);
    
    res.json(messages);
  } catch (error) {
    console.error('Hiba az inbox lekérésekor:', error);
    res.status(500).json({ message: 'Hiba az üzenetek lekérésekor.' });
  }
};

// Kimenő üzenetek lekérése
exports.getOutbox = async (req, res) => {
  try {
    const [messages] = await db.query('SELECT * FROM messages WHERE sender_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Hiba a kimenő üzenetek lekérésekor.' });
  }
};

// Üzenet olvasottnak jelölése
exports.markAsRead = async (req, res) => {
  try {
    await db.query('UPDATE messages SET is_read = 1 WHERE id = ? AND receiver_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Hiba az állapot frissítésekor.' });
  }
};