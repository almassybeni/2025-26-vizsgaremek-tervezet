const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const initDatabase = async () => {
  console.log('⏳ Adatbázis inicializálása az összes túrával...');

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

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`);
    await connection.query(`USE \`${dbName}\``);

    await connection.query(`SET FOREIGN_KEY_CHECKS = 0`);
    const tables = ['bookings', 'tour_destinations', 'tour_dates', 'messages', 'password_resets', 'tours', 'users'];
    for (const table of tables) {
      await connection.query(`DROP TABLE IF EXISTS \`${table}\``);
    }
    await connection.query(`SET FOREIGN_KEY_CHECKS = 1`);

    const sqlCommands = `
      CREATE TABLE users (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        email varchar(100) NOT NULL UNIQUE,
        password_hash varchar(255) NOT NULL,
        name varchar(100) NOT NULL,
        role enum('admin','client') DEFAULT 'client',
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        last_login timestamp NULL DEFAULT NULL,
        phone_number varchar(20) DEFAULT NULL,
        address varchar(255) DEFAULT NULL,
        is_active tinyint(1) DEFAULT 1
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE tours (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        title varchar(200) NOT NULL,
        description text NOT NULL,
        city varchar(100) NOT NULL,
        country varchar(100) DEFAULT 'Magyarország',
        region varchar(100) NOT NULL,
        duration varchar(50) NOT NULL,
        price int(11) NOT NULL,
        image varchar(255) NOT NULL,
        max_participants int(11) DEFAULT 15,
        highlights TEXT DEFAULT NULL,
        included TEXT DEFAULT NULL,
        not_included TEXT DEFAULT NULL,
        meta_title VARCHAR(255) DEFAULT NULL,
        meta_description TEXT DEFAULT NULL,
        type enum('upcoming','long','daily') DEFAULT 'daily',
        is_active tinyint(1) DEFAULT 1,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        created_by int(11) DEFAULT NULL,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE tour_destinations (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        tour_id int(11) NOT NULL,
        destination_name varchar(255) NOT NULL,
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE tour_dates (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        tour_id int(11) NOT NULL,
        start_date date NOT NULL,
        available_spots int(11) NOT NULL,
        end_date date DEFAULT NULL,
        is_active tinyint(1) DEFAULT 1,
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        tour_id INT NOT NULL,
        tour_date DATE NOT NULL,
        participants_count INT NOT NULL,
        total_price INT DEFAULT 0,
        special_requests TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

      CREATE TABLE messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT DEFAULT NULL,
        receiver_id INT DEFAULT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'general',
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    await connection.query(sqlCommands);

    const hashedAdminPw = await bcrypt.hash('admin123', 10);
    const hashedUserPw = await bcrypt.hash('user123', 10);

    await connection.query(
      `INSERT INTO users (id, email, password_hash, name, role) VALUES 
      (1, 'admin@gasztrokalandok.hu', ?, 'Admin', 'admin'),
      (2, 'kovacsvok@gmail.com', ?, 'Teszt Felhasználó', 'client')`,
      [hashedAdminPw, hashedUserPw]
    );

    // --- ÖSSZES TÚRA BESZÚRÁSA A FRONTEND ADATAI ALAPJÁN ---
    // A toursData.js tartalmát illesztjük be ide, kiegészítve a hiányzó mezőkkel
    const toursToInsert = [
      {
        id: 1, title: 'Autentikus Puszta Gulyás Séta', description: 'Fedezze fel a Hortobágy ízeit egy hagyományőrző tanyasi lakoma keretében.', city: 'Hortobágy', region: 'alfold', type: 'upcoming', duration: '4 óra', price: 18900, image: 'puszta-gulyas.jpg', max_participants: 20,
        highlights: JSON.stringify(["Gulyásfőzés bográcsban", "Szekerezés", "Pásztormúzeum látogatás"]), included: JSON.stringify(["Ebéd", "Idegenvezetés"]), not_included: JSON.stringify(["Italok a menün kívül"]), meta_title: "Puszta Gulyás Séta Hortobágyon", meta_description: "Hagyományőrző gulyásfőzés és tanyasi élmények a Hortobágyon."
      },
      {
        id: 2, title: 'Tanyasi Tej és Sajtmanufaktúra', description: 'Kézműves sajtkóstoló és betekintés a pusztai tejfeldolgozás titkaiba.', city: 'Kecskemét', region: 'alfold', type: 'upcoming', duration: '3 óra', price: 14500, image: 'puszta-tej.jpg', max_participants: 15,
        highlights: JSON.stringify(["Sajtkészítés bemutató", "10 féle sajt kóstolása"]), included: JSON.stringify(["Kóstoló tál", "Ajándék hűtőmágnes"]), not_included: JSON.stringify(["Szállítás"]), meta_title: "Sajtmanufaktúra Kecskeméten", meta_description: "Kézműves sajtkóstoló és tejfeldolgozás a Kecskeméti pusztán."
      },
      {
        id: 3, title: 'Egri Bikavér és Pincetúra', description: 'Ismerje meg az Egri Bikavér történetét és a Szépasszony-völgy legmélyebb pincéit.', city: 'Eger', region: 'tokaj', type: 'upcoming', duration: '5 óra', price: 22000, image: 'eger-wine.jpg', max_participants: 12,
        highlights: JSON.stringify(["6 tételes borkóstoló", "Pincejárás fáklyával"]), included: JSON.stringify(["Borkóstoló", "Borkorcsolyák"]), not_included: JSON.stringify(["Vacsora"]), meta_title: "Egri Bikavér Pincetúra", meta_description: "Fedezze fel az Egri Bikavér titkait a Szépasszony-völgyben."
      },
      {
        id: 4, title: 'Tokaji Kastélyok és Borok', description: 'Prémium dűlőtúra és borkóstoló a történelmi Tokaj-hegyalján.', city: 'Tokaj', region: 'tokaj', type: 'upcoming', duration: '6 óra', price: 35000, image: 'tokaj-kastely.jpg', max_participants: 10,
        highlights: JSON.stringify(["Aszú különlegességek", "Kastélylátogatás"]), included: JSON.stringify(["Ebéd", "Prémium borok"]), not_included: JSON.stringify(["Szállás"]), meta_title: "Tokaji Kastélyok és Borok Túra", meta_description: "Prémium borkóstoló és kastélylátogatás Tokaj-hegyalján."
      },
      {
        id: 101, title: 'Balaton-felvidéki Panoráma', description: '3 napos gasztro-hétvége a Balaton legszebb lankái között.', city: 'Badacsony', region: 'balaton', type: 'long', duration: '3 nap', price: 125000, image: 'balaton-felvidek.jpg', max_participants: 8,
        highlights: JSON.stringify(["Vitorlázás", "Hajnali piacozás"]), included: JSON.stringify(["Szállás", "Teljes ellátás"]), not_included: JSON.stringify(["Utazási biztosítás"]), meta_title: "Balaton-felvidéki Panoráma Hétvége", meta_description: "Gasztro-hétvége a Balaton-felvidék festői tájain."
      },
      {
        id: 102, title: 'Aszú Felfedező Hétvége', description: 'Mélyedjen el a borok királyának világában Mád szívében.', city: 'Mád', region: 'tokaj', type: 'long', duration: '2 nap', price: 98000, image: 'tokaj.jpg', max_participants: 6,
        highlights: JSON.stringify(["Vertikális aszú kóstoló", "Dűlőbejárás terepjáróval"]), included: JSON.stringify(["Szállás reggelivel", "Gourmet vacsora"]), not_included: JSON.stringify(["Ebéd"]), meta_title: "Aszú Felfedező Hétvége Mádon", meta_description: "Mélyedjen el az aszúborok világában Mádon."
      },
      {
        id: 201, title: 'Békebeli Cukrászda Séta', description: 'Időutazás a Monarchia korabeli sütemények és kávéházak világába.', city: 'Budapest', region: 'budapest', type: 'daily', duration: '3 óra', price: 12500, image: 'budapest-cukraszda.jpg', max_participants: 15,
        highlights: JSON.stringify(["3 történelmi cukrászda", "Dobos torta kóstoló"]), included: JSON.stringify(["Sütemények", "Kávé/Tea"]), not_included: JSON.stringify(["Főétel"]), meta_title: "Békebeli Cukrászda Séta Budapesten", meta_description: "Fedezze fel Budapest történelmi cukrászdáit."
      },
      {
        id: 202, title: 'Nagyvásárcsarnok és Piac Séta', description: 'Kóstoló a pultok között Budapest legszebb vásárcsarnokában.', city: 'Budapest', region: 'budapest', type: 'daily', duration: '2 óra', price: 15000, image: 'budapest-market.jpg', max_participants: 20,
        highlights: JSON.stringify(["Helyi kistermelők", "Savanyúság kóstoló"]), included: JSON.stringify(["Kóstoló falatok", "Túravezetés"]), not_included: JSON.stringify(["Italok"]), meta_title: "Nagyvásárcsarnok Séta Budapesten", meta_description: "Kóstoló túra Budapest legnagyobb vásárcsarnokában."
      },
      {
        id: 203, title: 'Budapesti Klasszikusok', description: 'Lángos, Gulyás és kürtőskalács - minden, ami magyar.', city: 'Budapest', region: 'budapest', type: 'daily', duration: '4 óra', price: 18000, image: 'budapest.jpg', max_participants: 25,
        highlights: JSON.stringify(["Street food túra", "Városligeti séta"]), included: JSON.stringify(["Ebéd", "Desszert"]), not_included: JSON.stringify(["Belépők"]), meta_title: "Budapesti Klasszikusok Gasztrotúra", meta_description: "Kóstolja meg a magyar konyha klasszikusait Budapesten."
      },
      {
        id: 204, title: 'Történelmi Pince Séta', description: 'Városnézés Egerben és 3 tételes borkóstoló egy érseki pincében.', city: 'Eger', region: 'tokaj', type: 'daily', duration: '3 óra', price: 14900, image: 'eger-wine.jpg', max_participants: 15,
        highlights: JSON.stringify(["Várnézés", "Barokk belváros"]), included: JSON.stringify(["Borkóstoló"]), not_included: JSON.stringify(["Ebéd"]), meta_title: "Történelmi Pince Séta Egerben", meta_description: "Városnézés és borkóstoló Eger történelmi pincéiben."
      },
      {
        id: 205, title: 'Tihanyi Levendula és Halászlékóstoló', description: 'Panorámás ebéd az apátság alatt és levendulás finomságok.', city: 'Tihany', region: 'balaton', type: 'daily', duration: '4 óra', price: 19500, image: 'balaton-felvidek.jpg', max_participants: 12,
        highlights: JSON.stringify(["Levendulaház", "Balatoni panoráma"]), included: JSON.stringify(["Halászlé ebéd", "Sütemény"]), not_included: JSON.stringify(["Hajójegy"]), meta_title: "Tihanyi Levendula és Halászlékóstoló", meta_description: "Levendula élmény és halászlékóstoló Tihanyban."
      },
      {
        id: 206, title: 'Szegedi Halászlé Fesztivál', description: 'Kóstolja meg a híres szegedi halászlevet a Tisza partján.', city: 'Szeged', region: 'alfold', type: 'daily', duration: '5 óra', price: 16000, image: 'szeged-halaszle.jpg', max_participants: 30,
        highlights: JSON.stringify(["Halászlé kóstoló", "Tisza-parti séta", "Szegedi Dóm látogatás"]), included: JSON.stringify(["Ebéd", "Idegenvezetés"]), not_included: JSON.stringify(["Italok"]), meta_title: "Szegedi Halászlé Fesztivál Túra", meta_description: "Kóstolja meg a híres szegedi halászlevet."
      },
      {
        id: 207, title: 'Pécsi Bormámor és Világörökség', description: 'Fedezze fel Pécs történelmi borvidékét és UNESCO világörökségi helyszíneit.', city: 'Pécs', region: 'dunantul', type: 'daily', duration: '6 óra', price: 21000, image: 'pecs-bor.jpg', max_participants: 18,
        highlights: JSON.stringify(["Borkóstoló a Pécsi Borvidéken", "Ókeresztény Sírkamrák", "Zsolnay Kulturális Negyed"]), included: JSON.stringify(["Borkóstoló", "Belépők"]), not_included: JSON.stringify(["Ebéd"]), meta_title: "Pécsi Bormámor és Világörökség Túra", meta_description: "Pécsi borkóstoló és világörökségi látnivalók."
      },
      {
        id: 208, title: 'Debreceni Ízek és Református Örökség', description: 'Kóstolja meg Debrecen jellegzetes ételeit és ismerje meg a város gazdag történelmét.', city: 'Debrecen', region: 'alfold', type: 'daily', duration: '4 óra', price: 13500, image: 'debrecen-iz.jpg', max_participants: 22,
        highlights: JSON.stringify(["Debreceni kolbász kóstoló", "Református Nagytemplom", "Déri Múzeum"]), included: JSON.stringify(["Kóstolók", "Idegenvezetés"]), not_included: JSON.stringify(["Belépők"]), meta_title: "Debreceni Ízek és Református Örökség Túra", meta_description: "Debreceni gasztro és történelmi séta."
      }
    ];

    for (const t of toursToInsert) {
      await connection.query(
        `INSERT INTO tours (id, title, description, city, country, region, type, duration, price, image, max_participants, created_by, is_active, highlights, included, not_included, meta_title, meta_description) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          t.id, t.title, t.description, t.city, t.country || 'Magyarország', t.region, t.type, t.duration, t.price, t.image, t.max_participants, 1, 1,
          t.highlights, t.included, t.not_included, t.meta_title, t.meta_description
        ]
      );
      // Minden túrához adunk egy alapértelmezett dátumot is, hogy foglalható legyen
      await connection.query(
        `INSERT INTO tour_dates (tour_id, start_date, end_date, available_spots) VALUES (?, ?, ?, ?)`,
        [t.id, '2026-06-15', '2026-06-15', t.max_participants]
      );
    }

    console.log(`✅ ${toursToInsert.length} túra sikeresen feltöltve.`);

  } catch (error) {
    console.error('❌ Hiba:', error.message);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
};

module.exports = initDatabase;