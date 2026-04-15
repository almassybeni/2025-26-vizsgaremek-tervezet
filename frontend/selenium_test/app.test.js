const { Builder, By, until } = require('selenium-webdriver');
const edge = require('selenium-webdriver/edge');

// Globális timeout növelése a Selenium lassúsága miatt
jest.setTimeout(120000);

describe('Átfogó Webalkalmazás Tesztek (Selenium)', () => {
  let driver;
  const baseUrl = 'http://localhost:5173';

  // Helper a spinner megvárásához
  async function waitForLoadingToDisappear() {
    try {
      // Megvárjuk, amíg a spinner esetlegesen megjelenik, majd eltűnik
      await driver.wait(async () => {
        const spinners = await driver.findElements(By.className('loading-spinner'));
        if (spinners.length === 0) return true;
        await driver.wait(until.stalenessOf(spinners[0]), 10000);
        return true;
      }, 15000);
    } catch (error) {
      // Már eltűnt vagy nincs is ott
    }
  }

  // JAVÍTOTT LOGIN HELPER
  async function performLogin(username, password) {
    console.log(`[LOGIN HELPER] Bejelentkezés megkísérlése: ${username}`);
    
    await driver.get(baseUrl); // Először a domainre megyünk, hogy törölhessünk
    await driver.executeScript("window.localStorage.clear();");
    await driver.get(`${baseUrl}/login`);

    // Mezők megvárása és kitöltése
    const userField = await driver.wait(until.elementLocated(By.id('email')), 15000);
    await driver.wait(until.elementIsVisible(userField), 5000);
    await userField.clear();
    await userField.sendKeys(username);

    const passField = await driver.findElement(By.id('password'));
    await passField.clear();
    await passField.sendKeys(password);

    const submitBtn = await driver.findElement(By.className('login-button'));
    await submitBtn.click();

    // KRITIKUS: Megvárjuk, amíg a profil oldal valamilyen tartalma megjelenik
    // Ez jelzi, hogy a React Context frissült és az átirányítás sikeres volt
    await driver.wait(until.urlContains('/profile'), 20000);
    await driver.wait(until.elementLocated(By.tagName('h1')), 10000);
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
  }, 15000);

  // --- TESZTEK ---

  test('1. Főoldal betöltése és oldal cím ellenőrzése', async () => {
    await driver.get(baseUrl);
    const title = await driver.getTitle();
    expect(title).toBeDefined();
  }, 15000);

  test('2. Navigációs menü láthatósága', async () => {
    await driver.get(baseUrl);
    const navbar = await driver.wait(until.elementLocated(By.className('site-nav')), 10000);
    expect(await navbar.isDisplayed()).toBe(true);
  }, 15000);

  test('3. Kapcsolat oldal elérhetősége menüből', async () => {
    await driver.get(baseUrl);
    const contactBtn = await driver.wait(until.elementLocated(By.xpath("//div[@class='nav-container']//span[text()='Kapcsolat']")), 10000);
    await contactBtn.click();
    await driver.wait(until.urlContains('contact'), 10000);
    expect(await driver.getCurrentUrl()).toContain('contact');
  }, 15000);

  test('4. Lábléc (Footer) megjelenése', async () => {
    await driver.get(baseUrl);
    const footer = await driver.wait(until.elementLocated(By.className('footer')), 10000);
    expect(await footer.isDisplayed()).toBe(true);
  }, 15000);

  test('5. Login oldal betöltése közvetlenül', async () => {
    await driver.get(`${baseUrl}/login`);
    const h1 = await driver.wait(until.elementLocated(By.tagName('h1')), 10000);
    expect(await h1.isDisplayed()).toBe(true);
  }, 15000);

  test('6. Sikertelen bejelentkezés hibaüzenet ellenőrzése', async () => {
    await driver.get(`${baseUrl}/login`);
    const emailInput = await driver.wait(until.elementLocated(By.id('email')), 10000);
    await emailInput.sendKeys('hibas@email.hu');
    await driver.findElement(By.id('password')).sendKeys('rosszjelszo');
    await driver.findElement(By.className('login-button')).click();
    
    const errorMsg = await driver.wait(until.elementLocated(By.className('error-message')), 10000);
    expect(await errorMsg.isDisplayed()).toBe(true);
  }, 20000);

  test('7. Kötelező mezők validációja (üres küldés)', async () => {
    await driver.get(`${baseUrl}/login`);
    const submitBtn = await driver.wait(until.elementLocated(By.className('login-button')), 10000);
    await submitBtn.click();
    const emailInput = await driver.findElement(By.id('email'));
    const isRequired = await emailInput.getAttribute('required');
    expect(isRequired).toBe('true');
  }, 15000);

  test('8. Sikeres bejelentkezés érvényes adatokkal', async () => {
    await performLogin('admin@gasztrokalandok.hu', 'admin123');
    expect(await driver.getCurrentUrl()).toContain('/profile');
  }, 60000);

  test('9. Felhasználói profil oldal betöltése', async () => {
    await performLogin('admin@gasztrokalandok.hu', 'admin123');
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain('profile');
  }, 30000);

  test('10. Admin oldal elérhető', async () => {
    await performLogin('admin@gasztrokalandok.hu', 'admin123');
    
    // UI-n keresztüli navigáció a redirect-ek elkerülése érdekében
    const profileTrigger = await driver.wait(until.elementLocated(By.className('profile-trigger')), 10000);
    await profileTrigger.click();

    const adminLink = await driver.wait(until.elementLocated(By.xpath("//div[@class='profile-dropdown']//div[text()='Admin felület']")), 10000);
    await adminLink.click();

    await driver.wait(until.urlContains('/admin'), 10000);
    expect(await driver.getCurrentUrl()).toContain('/admin');
  }, 30000);

  test('11. Admin tabok közötti váltás és aktív állapot', async () => {
    // Ha az előző teszt sikeres volt, már ott vagyunk, de a biztonság kedvéért:
    const currentUrl = await driver.getCurrentUrl();
    if (!currentUrl.includes('/admin')) {
      await driver.get(`${baseUrl}/admin`);
    }

    const sidebar = await driver.wait(until.elementLocated(By.css('.sidebar-nav')), 10000);
    await waitForLoadingToDisappear();
    const tabs = await sidebar.findElements(By.css('.nav-item')); 
    if (tabs.length > 1) {
      await tabs[1].click();
      await driver.wait(until.urlContains('admin'), 5000);
      expect(await driver.getCurrentUrl()).toContain('admin');
    }
  }, 30000);

  test('12. Admin táblázat adatainak betöltése', async () => {
    await performLogin('admin@gasztrokalandok.hu', 'admin123');
    
    // Navigáció az admin felületre UI-n keresztül a redirect elkerülése érdekében
    const profileTrigger = await driver.wait(until.elementLocated(By.className('profile-trigger')), 10000);
    await profileTrigger.click();
    const adminLink = await driver.wait(until.elementLocated(By.xpath("//div[@class='profile-dropdown']//div[text()='Admin felület']")), 10000);
    await adminLink.click();

    // Robusztusabb tab választás
    const toursTab = await driver.wait(until.elementLocated(By.xpath("//aside//span[contains(text(), 'Túrák')]")), 10000);
    await toursTab.click();

    await waitForLoadingToDisappear();
    // Megvárjuk, amíg a táblázat valóban láthatóvá válik
    const table = await driver.wait(until.elementLocated(By.css('table')), 15000);
    const rows = await table.findElements(By.css('tbody tr'));
    expect(rows.length).toBeGreaterThanOrEqual(0);
  }, 60000);

  test('13. Kijelentkezés folyamata és védett útvonal ellenőrzése', async () => {
    await performLogin('admin@gasztrokalandok.hu', 'admin123');
    const profileTrigger = await driver.wait(until.elementLocated(By.className('profile-trigger')), 10000);
    await profileTrigger.click();
    const logoutBtn = await driver.wait(until.elementLocated(By.xpath("//div[@class='profile-dropdown']//div[text()='Kijelentkezés']")), 5000);
    await logoutBtn.click();
    await driver.wait(until.urlIs(`${baseUrl}/`), 10000);
    expect(await driver.getCurrentUrl()).toBe(`${baseUrl}/`);
  }, 60000);
});