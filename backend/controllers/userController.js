const db = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT id, email, name, role, created_at, last_login, is_active, phone_number 
      FROM users 
      ORDER BY created_at DESC
    `);

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone_number, role, is_active } = req.body;

    if ((role || is_active !== undefined) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Nincs jogosultságod' });
    }

    let query = 'UPDATE users SET name = ?, phone_number = ?';
    const params = [name, phone_number];

    if (role && req.user.role === 'admin') {
      query += ', role = ?';
      params.push(role);
    }

    if (is_active !== undefined && req.user.role === 'admin') {
      query += ', is_active = ?';
      params.push(is_active);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await db.query(query, params);

    res.json({ message: 'Felhasználó frissítve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

exports.requestPasswordChange = async (req, res) => {
  try {
    const { user_id } = req.body;

    const token = crypto.randomBytes(32).toString('hex');
    const expires_at = new Date();
    expires_at.setHours(expires_at.getHours() + 24);

    await db.query(`
      INSERT INTO password_resets (user_id, token, expires_at, requested_by)
      VALUES (?, ?, ?, ?)
    `, [user_id, token, expires_at, req.user.id]);

    res.json({ message: 'Jelszóváltoztatási kérelem elküldve', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

exports.changePasswordWithToken = async (req, res) => {
  try {
    const { token, new_password } = req.body;

    const [resets] = await db.query(`
      SELECT * FROM password_resets 
      WHERE token = ? AND is_used = 0 AND expires_at > NOW()
    `, [token]);

    if (resets.length === 0) {
      return res.status(400).json({ message: 'Érvénytelen vagy lejárt token' });
    }

    const reset = resets[0];

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, reset.user_id]);

    await db.query('UPDATE password_resets SET is_used = 1 WHERE id = ?', [reset.id]);

    res.json({ message: 'Jelszó sikeresen módosítva' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};