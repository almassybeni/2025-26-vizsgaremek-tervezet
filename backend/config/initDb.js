const db = require('./db');

const initDatabase = async () => {
  try {
    await db.query(`CREATE DATABASE IF NOT EXISTS kulturvadasz`);
    await db.query(`USE kulturvadasz`);

    // users tábla
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        role ENUM('admin', 'client') DEFAULT 'client',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        is_active BOOLEAN DEFAULT TRUE,
        profile_picture VARCHAR(255) NULL,
        phone_number VARCHAR(20) NULL
      )
    `);

    // tours tábla
    await db.query(`
      CREATE TABLE IF NOT EXISTS tours (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL,
        region VARCHAR(100) NOT NULL,
        duration VARCHAR(50) NOT NULL,
        price INT NOT NULL,
        image VARCHAR(255) NOT NULL,
        max_participants INT DEFAULT 15,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        created_by INT,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // tour_destinations tábla
    await db.query(`
      CREATE TABLE IF NOT EXISTS tour_destinations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tour_id INT NOT NULL,
        destination_name VARCHAR(100) NOT NULL,
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
      )
    `);

    // bookings tábla
    await db.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        tour_id INT NOT NULL,
        booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tour_date DATE NOT NULL,
        participants_count INT NOT NULL,
        total_price INT NOT NULL,
        status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
        special_requests TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
      )
    `);

    // tour_dates tábla
    await db.query(`
      CREATE TABLE IF NOT EXISTS tour_dates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tour_id INT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        available_spots INT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
      )
    `);

    // password_resets tábla
    await db.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        is_used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        requested_by INT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // messages tábla
    await db.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        subject VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('password_change', 'general', 'notification') DEFAULT 'general',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Admin felhasználó ellenőrzése
    const [admins] = await db.query(`SELECT * FROM users WHERE role = 'admin'`);
    
    if (admins.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await db.query(`
        INSERT INTO users (email, password_hash, name, role) 
        VALUES (?, ?, ?, 'admin')
      `, ['admin@gasztrokalandok.hu', hashedPassword, 'Admin']);
    }

    // Teszt adatok
    const [tours] = await db.query(`SELECT * FROM tours`);
    
    if (tours.length === 0) {
      const [admin] = await db.query(`SELECT id FROM users WHERE role = 'admin' LIMIT 1`);
      const adminId = admin[0].id;

      const toursData = [
        ['Nagypiac & Belvárosi Ízek', 'Fedezze fel a budapesti Nagypiacot és a belváros rejtett kulináris kincseit.', 'Budapest', 'Magyarország', 'Közép-Európa', '6 óra', 18990, 'budapest-market.jpg', 12, adminId],
        ['Egri Borkultúra & Történelmi Pincék', 'Ismerje meg az egri borvidék hagyományait.', 'Eger', 'Magyarország', 'Közép-Európa', '8 óra', 24990, 'eger-wine.jpg', 10, adminId],
        ['Szegedi Halászlé & Tisza-parti Ízek', 'A szegedi halászlé főzésének titkait ismerheti meg.', 'Szeged', 'Magyarország', 'Közép-Európa', '5 óra', 15990, 'szeged-fishsoup.jpg', 15, adminId]
      ];

      for (const tour of toursData) {
        await db.query(`
          INSERT INTO tours (title, description, city, country, region, duration, price, image, max_participants, created_by) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, tour);
      }
    }
  } catch (error) {
    console.error('Adatbázis inicializálási hiba:', error);
  }
};

module.exports = initDatabase;