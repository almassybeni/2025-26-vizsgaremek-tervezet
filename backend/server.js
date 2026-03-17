// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const initDatabase = require('./config/initDb');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Adatbázis inicializálás
(async () => {
  try {
    await initDatabase();
    console.log('✅ Adatbázis inicializálva');
  } catch (error) {
    console.error('❌ Adatbázis inicializálási hiba:', error);
  }
})();

// Route-ok importálása
const authRoutes = require('./routes/authRoutes');
const tourRoutes = require('./routes/tourRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Route-ok használata
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Teszt végpont
app.get('/api/test', (req, res) => {
  res.json({ message: 'API működik' });
});

// Alap route
app.get('/', (req, res) => {
  res.json({ message: 'GasztroKalandok API' });
});

// 404 kezelés
app.use((req, res) => {
  res.status(404).json({ message: `Nincs ilyen végpont: ${req.method} ${req.url}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Szerver hiba:', err);
  res.status(500).json({ message: 'Belső szerver hiba' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Szerver fut a ${PORT} porton`);
});