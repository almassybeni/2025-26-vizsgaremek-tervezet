const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const initDatabase = async () => {
  console.log('⏳ Adatbázis inicializálása a megadott SQL struktúra alapján...');

  // 1. Kapcsolódási opciók (multipleStatements kell a dump-hoz!)
  const connectionOptions = {
    host: process.env.DB_HOST || 'mysql-db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    multipleStatements: true, 
  };

  let connection;
  try {
    connection = await mysql.createConnection(connectionOptions);
    const dbName = process.env.DB_NAME || 'kulturvadasz';

    // 2. Adatbázis frissítése
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`);
    await connection.query(`USE \`${dbName}\``);

    // 3. Régi táblák eltávolítása kényszerek kikapcsolásával
    await connection.query(`SET FOREIGN_KEY_CHECKS = 0`);
    const tables = ['bookings', 'tour_destinations', 'tour_dates', 'messages', 'password_resets', 'tours', 'users'];
    for (const table of tables) {
      await connection.query(`DROP TABLE IF EXISTS \`${table}\``);
    }
    await connection.query(`SET FOREIGN_KEY_CHECKS = 1`);
    console.log('✅ Régi táblák törölve.');

    // 4. Az SQL Dump alapján összeállított struktúra
    const sqlCommands = `
      CREATE TABLE users (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        email varchar(100) NOT NULL UNIQUE,
        password_hash varchar(255) NOT NULL,
        name varchar(100) NOT NULL,
        role enum('admin','client') DEFAULT 'client',
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login timestamp NULL DEFAULT NULL,
        is_active tinyint(1) DEFAULT 1,
        profile_picture varchar(255) DEFAULT NULL,
        phone_number varchar(20) DEFAULT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE tours (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        title varchar(200) NOT NULL,
        description text NOT NULL,
        city varchar(100) NOT NULL,
        country varchar(100) NOT NULL,
        region varchar(100) NOT NULL,
        duration varchar(50) NOT NULL,
        price int(11) NOT NULL,
        image varchar(255) NOT NULL,
        max_participants int(11) DEFAULT 15,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_active tinyint(1) DEFAULT 1,
        created_by int(11) DEFAULT NULL,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE tour_dates (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        tour_id int(11) NOT NULL,
        start_date date NOT NULL,
        end_date date NOT NULL,
        available_spots int(11) NOT NULL,
        is_active tinyint(1) DEFAULT 1,
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE tour_destinations (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        tour_id int(11) NOT NULL,
        destination_name varchar(100) NOT NULL,
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE messages (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        sender_id int(11) NOT NULL,
        receiver_id int(11) NOT NULL,
        subject varchar(200) NOT NULL,
        message text NOT NULL,
        type enum('password_change','general','notification') DEFAULT 'general',
        is_read tinyint(1) DEFAULT 0,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE password_resets (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id int(11) NOT NULL,
        token varchar(255) NOT NULL,
        expires_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_used tinyint(1) DEFAULT 0,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        requested_by int(11) DEFAULT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE bookings (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id int(11) NOT NULL,
        tour_id int(11) NOT NULL,
        booking_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        tour_date date NOT NULL,
        participants_count int(11) NOT NULL,
        total_price int(11) NOT NULL,
        status enum('pending','confirmed','cancelled','completed') DEFAULT 'pending',
        special_requests text DEFAULT NULL,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    await connection.query(sqlCommands);
    console.log('✅ Táblaszerkezet létrehozva.');

    // 5. ADATOK FELTÖLTÉSE
    // Jelszavak titkosítása (admin123 és user123)
    const hashedAdminPw = await bcrypt.hash('admin123', 10);
    const hashedUserPw = await bcrypt.hash('user123', 10);

    // Felhasználók beszúrása
    await connection.query(
      `INSERT INTO users (id, email, password_hash, name, role) VALUES 
      (1, 'admin@gasztrokalandok.hu', ?, 'Admin', 'admin'),
      (2, 'kovacsvok@gmail.com', ?, 'Kovacs Joszef', 'client')`,
      [hashedAdminPw, hashedUserPw]
    );

    // Túrák beszúrása
    await connection.query(`
      INSERT INTO tours (id, title, description, city, country, region, duration, price, image, max_participants, created_by) VALUES
      (1, 'Nagypiac & Belvárosi Ízek', 'Fedezze fel a budapesti Nagypiacot és a belváros rejtett kulináris kincseit. Kóstolja meg a legjobb magyar kolbászokat, sajtokat és friss pékárukat.', 'Budapest', 'Magyarország', 'Közép-Európa', '6 óra', 18990, 'budapest-market.jpg', 12, 1),
      (2, 'Egri Borkultúra & Történelmi Pincék', 'Ismerje meg az egri borvidék hagyományait és látogasson el történelmi pincékbe. A túra során megkóstolja a híres Egri Bikavért.', 'Eger', 'Magyarország', 'Közép-Európa', '8 óra', 24990, 'eger-wine.jpg', 10, 1),
      (3, 'Szegedi Halászlé & Tisza-parti Ízek', 'A szegedi halászlé főzésének titkait ismerheti meg, miközben a Tisza-parti hangulatos vendéglőkben kóstol.', 'Szeged', 'Magyarország', 'Közép-Európa', '5 óra', 15990, 'szeged-fishsoup.jpg', 15, 1)
    `);

    // Időpontok beszúrása
    await connection.query(`
      INSERT INTO tour_dates (tour_id, start_date, end_date, available_spots) VALUES
      (1, '2024-06-15', '2024-06-15', 12), (1, '2024-06-22', '2024-06-22', 12), (1, '2024-06-29', '2024-06-29', 12),
      (2, '2024-06-15', '2024-06-15', 10), (2, '2024-06-22', '2024-06-22', 10), (2, '2024-06-29', '2024-06-29', 10),
      (3, '2024-06-15', '2024-06-15', 15), (3, '2024-06-22', '2024-06-22', 15), (3, '2024-06-29', '2024-06-29', 15)
    `);

    // Állomások beszúrása
    await connection.query(`
      INSERT INTO tour_destinations (tour_id, destination_name) VALUES
      (1, 'Budapest'), (1, 'Nagypiac'), (1, 'Belváros'),
      (2, 'Eger'), (2, 'Szépasszonyvölgy'), (2, 'Egri borvidék'),
      (3, 'Szeged'), (3, 'Tisza-part'), (3, 'Móra Ferenc Múzeum')
    `);

    console.log('✅ Adatok sikeresen feltöltve.');

  } catch (error) {
    console.error('❌ Hiba az inicializálás során:', error.message);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
};

module.exports = initDatabase;