const db = require('./db'); // Vagy ahol a db.js fájlod van
const bcrypt = require('bcryptjs');

const initDatabase = async () => {
  console.log('⏳ Adatbázis inicializálása megkezdődött...');

  try {
    // 1. Adatbázis létrehozása és kiválasztása
    await db.query(`CREATE DATABASE IF NOT EXISTS kulturvadasz CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await db.query(`USE kulturvadasz`);
    console.log('✅ Adatbázis kiválasztva (kulturvadasz).');

    // 2. Tiszta lap: Meglévő táblák törlése (Idegen kulcsok kikapcsolásával)
    // Ez garantálja, hogy a vizsgán mindig friss, tiszta rendszert tudsz mutatni
    await db.query(`SET FOREIGN_KEY_CHECKS = 0`);
    await db.query(`
      DROP TABLE IF EXISTS 
        bookings, 
        tour_destinations, 
        tour_dates, 
        messages, 
        password_resets, 
        tours, 
        users
    `);
    await db.query(`SET FOREIGN_KEY_CHECKS = 1`);
    console.log('✅ Régi táblák törölve (Tiszta lap).');

    // ==========================================
    // 3. TÁBLÁK LÉTREHOZÁSA (KAPCSOLATOKKAL)
    // ==========================================

    // Users tábla
    await db.query(`
      CREATE TABLE users (
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

    // Tours (Túrák) tábla
    await db.query(`
      CREATE TABLE tours (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        country VARCHAR(100) NOT NULL,
        region VARCHAR(100) NOT NULL,
        type ENUM('daily', 'long', 'upcoming') DEFAULT 'daily',
        duration VARCHAR(50) NOT NULL,
        price INT NOT NULL,
        image VARCHAR(255) NOT NULL,
        max_participants INT DEFAULT 15,
        meta_title VARCHAR(255) NULL,
        meta_description TEXT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        status ENUM('draft', 'active', 'inactive') DEFAULT 'draft',
        highlights JSON NULL,
        included JSON NULL,
        not_included JSON NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_by INT,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Tour Destinations (Célállomások)
    await db.query(`
      CREATE TABLE tour_destinations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tour_id INT NOT NULL,
        destination_name VARCHAR(100) NOT NULL,
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
      )
    `);

    // Bookings (Foglalások) tábla
    await db.query(`
      CREATE TABLE bookings (
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

    // Tour Dates (Túra időpontok)
    await db.query(`
      CREATE TABLE tour_dates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tour_id INT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        available_spots INT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
      )
    `);

    // Password Resets (Jelszó visszaállítás)
    await db.query(`
      CREATE TABLE password_resets (
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

    // Messages (Üzenetek) tábla
    await db.query(`
      CREATE TABLE messages (
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

    console.log('✅ Táblaszerkezet (Schema) sikeresen létrehozva.');

    // ==========================================
    // 4. TESZT ADATOK FELTÖLTÉSE (Seeding)
    // ==========================================

    // Admin és egy alap felhasználó létrehozása
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedUserPassword = await bcrypt.hash('user123', 10);

    const [adminResult] = await db.query(`
      INSERT INTO users (email, password_hash, name, role, phone_number) 
      VALUES (?, ?, ?, 'admin', ?)
    `, ['admin@kulturvadasz.hu', hashedAdminPassword, 'Fő Adminisztrátor', '+36301234567']);
    
    await db.query(`
      INSERT INTO users (email, password_hash, name, role, phone_number) 
      VALUES (?, ?, ?, 'client', ?)
    `, ['teszt@felhasznalo.hu', hashedUserPassword, 'Teszt Elek', '+36209876543']);

    const adminId = adminResult.insertId;
    console.log('✅ Teszt felhasználók (Admin és Kliens) létrehozva.');

    // Teszt túrák létrehozása
    const emptyArray = JSON.stringify([]);
    const toursData = [
      ['Nagypiac & Belvárosi Ízek', 'Fedezze fel a budapesti Nagypiacot és a belváros rejtett kulináris kincseit egy félnapos túra keretében.', 'Budapest', 'Magyarország', 'Közép-Európa', '6 óra', 18990, 'budapest-market.jpg', 12, adminId, 'nagypiac-belvarosi-izek', 'active', emptyArray, emptyArray, emptyArray],
      ['Egri Borkultúra & Történelmi Pincék', 'Ismerje meg az egri borvidék hagyományait, kóstoljon bele a híres Bikavérbe.', 'Eger', 'Magyarország', 'Közép-Európa', '8 óra', 24990, 'eger-wine.jpg', 10, adminId, 'egri-borkultura-tortenelmi-pincek', 'active', emptyArray, emptyArray, emptyArray],
      ['Szegedi Halászlé & Tisza-parti Ízek', 'A szegedi halászlé főzésének titkait ismerheti meg egyenesen a halászmesterektől.', 'Szeged', 'Magyarország', 'Közép-Európa', '5 óra', 15990, 'szeged-fishsoup.jpg', 15, adminId, 'szegedi-halaszle-tisza-parti-izek', 'active', emptyArray, emptyArray, emptyArray]
    ];

    for (const tour of toursData) {
      await db.query(`
        INSERT INTO tours (
          title, description, city, country, region, duration, price, image, 
          max_participants, created_by, slug, status, highlights, included, not_included
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, tour);
    }
    console.log('✅ Teszt túrák sikeresen feltöltve.');

    console.log(' Az adatbázis telepítése sikeresen befejeződött!');
    

  } catch (error) {
    console.error('❌ VÉGZETES HIBA az adatbázis inicializálása során:');
    console.error(error);
   
  }
};

// Ha ezt a fájlt közvetlenül indítják (pl. node initDb.js)
if (require.main === module) {
  initDatabase();
} else {
  module.exports = initDatabase;
}