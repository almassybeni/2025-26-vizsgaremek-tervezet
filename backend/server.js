const express = require('express');
const cors = require('cors');
const initDatabase = require('./config/initDb');
const db = require('./config/db'); // Ez most már a pool

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Útvonalak regisztrálása
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tours', require('./routes/tourRoutes'));
// ... a többi útvonal

const startServer = async () => {
  try {
    await initDatabase();
    
    // Teszteljük a kapcsolatot
    const conn = await db.getConnection();
    console.log('✅ Adatbázis kapcsolat OK');
    conn.release();

    app.listen(5000, '0.0.0.0', () => {
      console.log('🚀 Szerver fut: http://localhost:5000');
    });
  } catch (err) {
    console.error('❌ Hiba:', err);
  }
};

startServer();