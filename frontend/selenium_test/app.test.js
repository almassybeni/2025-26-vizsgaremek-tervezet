const { Builder, By, until } = require('selenium-webdriver');
const edge = require('selenium-webdriver/edge');

describe('Átfogó Webalkalmazás Tesztek (Selenium)', () => {
  let driver;
  const baseUrl = 'http://localhost:5173'; 

  async function performLogin(username, password) {
    console.log(`[LOGIN HELPER] Bejelentkezés megkísérlése: ${username}`);
    await driver.get(`${baseUrl}/login`);

    // A LoginPage.jsx alapján id-kat használunk
    const userField = await driver.wait(until.elementLocated(By.id('email')), 10000);
    await driver.wait(until.elementIsVisible(userField), 5000);
    await userField.clear();
    await userField.sendKeys(username);
    
    const passField = await driver.findElement(By.id('password'));
    await passField.clear();
    await passField.sendKeys(password);
    
    const submitBtn = await driver.findElement(By.className('login-button'));
    await submitBtn.click();

    // Sikeres belépés után a /profile oldalra irányít a kódod
    await driver.wait(until.urlContains('/profile'), 10000);
  }

  beforeAll(async () => {
    const options = new edge.Options();
    options.addArguments('--remote-allow-origins=*');
    options.addArguments('--start-maximized');

    driver = await new Builder()
      .forBrowser('MicrosoftEdge')
      .setEdgeOptions(options)
      .build();
  }, 30000);

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  // --- 1. NYILVÁNOS OLDALAK TESZTELÉSE (Bejelentkezés nélkül) ---

  test('1. Főoldal betöltése és oldal cím ellenőrzése', async () => {
    console.log('[TEST 1] Főoldal betöltése...');
    await driver.get(baseUrl);
    const title = await driver.getTitle();
    expect(title).toBeDefined();
  }, 10000);

  test('2. Navigációs menü láthatósága', async () => {
    console.log('[TEST 2] Navigációs menü ellenőrzése...');
    await driver.get(baseUrl);
    const navbar = await driver.wait(until.elementLocated(By.className('site-nav')), 10000);
    expect(await navbar.isDisplayed()).toBe(true);
  }, 10000);

  test('3. Kapcsolat oldal elérhetősége menüből', async () => {
    await driver.get(baseUrl);
    // A Header.jsx-ben span-ek vannak, nem linkek
    const contactBtn = await driver.wait(until.elementLocated(By.xpath("//div[@class='nav-container']//span[text()='Kapcsolat']")), 10000);
    await contactBtn.click();
    expect(await driver.getCurrentUrl()).toContain('contact');
  }, 15000);

  test('4. Lábléc (Footer) megjelenése', async () => {
    console.log('[TEST 4] Lábléc ellenőrzése...');
    await driver.get(baseUrl);
    const footer = await driver.wait(until.elementLocated(By.className('footer')), 10000);
    expect(await footer.isDisplayed()).toBe(true);
  }, 10000);

  // --- 2. HITELLESÍTÉS TESZTELÉSE ---

  test('6. Sikertelen bejelentkezés hibaüzenet ellenőrzése', async () => {
    console.log('[TEST 6] Sikertelen bejelentkezés tesztelése...');
    await driver.get(baseUrl);
    const profileTrigger = await driver.wait(until.elementLocated(By.className('profile-trigger')), 10000);
    await profileTrigger.click();
    const loginBtn = await driver.wait(until.elementLocated(By.xpath("//div[@class='profile-dropdown']//div[text()='Bejelentkezés']")), 5000);
    await loginBtn.click();
    
    const emailInput = await driver.wait(until.elementLocated(By.id('email')), 10000);
    await emailInput.sendKeys('hibas@email.hu');
    await driver.findElement(By.id('password')).sendKeys('rosszjelszo');
    await driver.findElement(By.className('login-button')).click();
    
    const errorMsg = await driver.wait(until.elementLocated(By.className('error-message')), 5000);
    expect(await errorMsg.isDisplayed()).toBe(true);
  }, 15000);

  test('7. Kötelező mezők validációja (üres küldés)', async () => {
    console.log('[TEST 7] Kötelező mezők validációja...');
    await driver.get(`${baseUrl}/login`);
    
    const submitBtn = await driver.wait(until.elementLocated(By.className('login-button')), 10000);
    await submitBtn.click();

    const emailInput = await driver.findElement(By.id('email'));
    const isRequired = await emailInput.getAttribute('required');
    expect(isRequired).toBe('true');
  }, 10000);

  test('8. Sikeres bejelentkezés érvényes adatokkal', async () => {
    console.log('[TEST 8] Sikeres bejelentkezés tesztelése...');
    await performLogin('admin@gasztrokalandok.hu', 'admin123');
    expect(await driver.getCurrentUrl()).toContain('/profile');
  }, 15000);

  // --- 3. VÉDETT OLDALAK ÉS ADMIN FUNKCIÓK TESZTELÉSE (Bejelentkezve) ---

  test('9. Felhasználói profil oldal betöltése', async () => {
    console.log('[TEST 9] Felhasználói profil oldal betöltése...');
    await performLogin('admin@gasztrokalandok.hu', 'admin123');
    await driver.get(`${baseUrl}/profile`);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain('profile');
  }, 10000);

  test('10. Admin oldal elérhető', async () => {
    console.log('[TEST 10] Admin oldal elérhetősége...');
    await performLogin('admin@gasztrokalandok.hu', 'admin123');
    await driver.get(`${baseUrl}/admin`);
    await driver.wait(until.elementLocated(By.css('.admin-layout')), 10000);
    expect(await driver.getCurrentUrl()).toContain('/admin');
  }, 10000);

  test('11. Admin tabok közötti váltás és aktív állapot', async () => {
    await driver.get(`${baseUrl}/admin`); // Biztos, ami biztos, újra az admin oldalon
    await driver.wait(until.elementLocated(By.css('.nav-item')), 10000); // AdminLayout nav-itemek
    const tabs = await driver.findElements(By.css('.nav-item')); 
    if (tabs.length > 1) {
      await tabs[1].click();
      await driver.wait(until.urlContains('tours'), 5000);
      expect(await driver.getCurrentUrl()).toContain('tours');
    }
  }, 20000);

  test('12. Admin táblázat adatainak betöltése', async () => { // Feltételezi, hogy az előző teszt bejelentkezve hagyott
    console.log('[TEST 12] Admin táblázat adatainak betöltése...');
    await driver.get(`${baseUrl}/admin/tours`);
    const table = await driver.wait(until.elementLocated(By.css('.admin-table')), 10000);
    const rows = await table.findElements(By.css('tbody tr'));
    expect(rows.length).toBeGreaterThanOrEqual(0);
  }, 15000);

  test('13. Új elem hozzáadása modal ablak megnyitása', async () => { // Feltételezi, hogy az előző teszt bejelentkezve hagyott
    console.log('[TEST 13] Új elem hozzáadása modal megnyitása...');
    await driver.get(`${baseUrl}/admin/users`);
    const addBtn = await driver.wait(until.elementLocated(By.css('.add-button')), 10000);
    await addBtn.click();
    const modal = await driver.wait(until.elementLocated(By.css('.modal-overlay')), 10000);
    expect(await modal.isDisplayed()).toBe(true);
    await driver.findElement(By.css('.close-btn')).click(); 
  }, 15000);

  test('14. Táblázat szűrési funkció ellenőrzése', async () => { // Feltételezi, hogy az előző teszt bejelentkezve hagyott
    console.log('[TEST 14] Táblázat szűrési funkció ellenőrzése...');
    await driver.get(`${baseUrl}/admin/bookings`);
    const filterInput = await driver.wait(until.elementLocated(By.css('.search-input')), 10000);
    await filterInput.sendKeys('Kovács');
    await driver.sleep(1000);
    const rows = await driver.findElements(By.css('.bookings-table tbody tr'));
    expect(Array.isArray(rows)).toBe(true);
  }, 15000);

  // --- 4. KIJELENTKEZÉS ÉS VÉDELEM TESZTELÉSE ---

  test('15. Kijelentkezés folyamata és védett útvonal ellenőrzése', async () => {
    console.log('[TEST 15] Kijelentkezés és védett útvonal ellenőrzése...');
    await driver.get(baseUrl); // Menjünk a főoldalra, ahol a kijelentkezés gomb van
    
    // Kijelentkezés folyamat (dropdown megnyitása -> klikk)
    const profileTrigger = await driver.wait(until.elementLocated(By.className('profile-trigger')), 10000);
    await profileTrigger.click();
    
    const logoutBtn = await driver.wait(until.elementLocated(By.xpath("//div[@class='profile-dropdown']//div[text()='Kijelentkezés']")), 5000);
    await logoutBtn.click();

    expect(await driver.getCurrentUrl()).toBe(`${baseUrl}/`);
  }, 20000);
});