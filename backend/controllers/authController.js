const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
  try {
    const { email, password, name, phone_number } = req.body;

    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Ez az email már regisztrálva van' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO users (email, password_hash, name, phone_number, role) 
       VALUES (?, ?, ?, ?, 'client')`,
      [email, hashedPassword, name, phone_number || null]
    );

    const token = jwt.sign(
      { id: result.insertId, email, name, role: 'client' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Sikeres regisztráció',
      token,
      user: {
        id: result.insertId,
        email,
        name,
        role: 'client'
      }
    });
  } catch (error) {
    console.error('Regisztrációs hiba:', error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ? AND is_active = 1',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Hibás email vagy jelszó' });
    }

    const user = users[0];

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Hibás email vagy jelszó' });
    }

    await db.query(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Sikeres bejelentkezés',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone_number: user.phone_number
      }
    });
  } catch (error) {
    console.error('Bejelentkezési hiba:', error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, email, name, role, created_at, last_login, phone_number FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Felhasználó nem található' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Profil lekérési hiba:', error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};