const mysql = require('mysql2/promise');

const db = mysql.createPool({
  // A process.env kiolvassa a docker-compose.yml-ből az adatokat!
  // Ha nem Dockerből indítod, akkor az "or" (||) utáni alapértékeket használja.
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', 
  database: process.env.DB_NAME || 'kulturvadasz',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Teszteljük a kapcsolatot induláskor
db.getConnection()
  .then(connection => {
    console.log('✅ Sikeresen csatlakozva a MySQL adatbázishoz!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Hiba az adatbázis csatlakozáskor:', err.message);
  });

module.exports = db;