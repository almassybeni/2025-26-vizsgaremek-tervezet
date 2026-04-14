const { Builder, By, until } = require('selenium-webdriver');
const edge = require('selenium-webdriver/edge');

// Globális Jest timeout növelése
jest.setTimeout(60000);

describe('Auth Modul Tesztek (Selenium)', () => {
  let driver;
  const baseUrl = 'http://localhost:5173';

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

  test('1. Sikeres Admin bejelentkezés (Modalon keresztül)', async () => {
    await driver.get(baseUrl);
    const loginBtn = await driver.wait(until.elementLocated(By.css('.btn-login')), 10000);
    await loginBtn.click();

    const emailInput = await driver.wait(until.elementLocated(By.css('.auth-card input[type="email"]')), 10000);
    await emailInput.sendKeys('admin@admin.com');
    
    const passwordInput = await driver.findElement(By.css('.auth-card input[name="password"]'));
    await passwordInput.sendKeys('admin1');
    
    await driver.findElement(By.css('.btn-submit-auth')).click();

    // Ellenőrizzük a bejelentkezés sikerességét
    await driver.wait(async () => {
      const loginBtns = await driver.findElements(By.css('.btn-login'));
      return loginBtns.length === 0;
    }, 10000);

    const loginBtnsAfter = await driver.findElements(By.css('.btn-login'));
    expect(loginBtnsAfter.length).toBe(0);
  }, 20000);

  test('2. Kijelentkezés folyamata', async () => {
    await driver.get(baseUrl);
    const profilDropdown = await driver.wait(until.elementLocated(By.css('.nav-right .profil-dropdown-toggle, .user-menu')), 10000);
    await profilDropdown.click();
    
    const logoutBtn = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Kijelentkezés') or contains(text(), 'Kilépés')]")), 5000);
    await logoutBtn.click();

    // SweetAlert2 vagy confirm modal kezelése
    try {
      const confirmBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(translate(text(), 'IGEN', 'igen'), 'igen') or contains(@class, 'swal2-confirm')]")), 5000);
      await confirmBtn.click();
    } catch (e) {
      console.log("Nem volt szükség megerősítő gombra vagy nem található.");
    }

    // Ellenőrizzük, hogy újra látható-e a bejelentkezés gomb
    const loginBtn = await driver.wait(until.elementLocated(By.css('.btn-login')), 10000);
    expect(await loginBtn.isDisplayed()).toBe(true);
  }, 20000);

  test('3. Sikertelen bejelentkezés (Rossz jelszó)', async () => {
    await driver.get(baseUrl);
    await driver.wait(until.elementLocated(By.css('.btn-login')), 10000).click();
    
    const emailInput = await driver.wait(until.elementLocated(By.css('.auth-card input[type="email"]')), 5000);
    await emailInput.sendKeys('admin@admin.com');
    await driver.findElement(By.css('.auth-card input[type="password"]')).sendKeys('rosszjelszo123');
    await driver.findElement(By.css('.btn-submit-auth')).click();
    
    const errorMsg = await driver.wait(until.elementLocated(By.css('.auth-error')), 5000);
    expect(await errorMsg.isDisplayed()).toBe(true);
  }, 15000);

  test('4. Bejelentkezés hibás email formátummal', async () => {
    await driver.get(baseUrl);
    await driver.wait(until.elementLocated(By.css('.btn-login')), 10000).click();
    
    const emailInput = await driver.wait(until.elementLocated(By.css('.auth-card input[type="email"]')), 5000);
    await emailInput.sendKeys('hibasemailformatum');
    await driver.findElement(By.css('.auth-card input[type="password"]')).sendKeys('admin1');
    
    const submitBtn = await driver.findElement(By.css('.btn-submit-auth'));
    await submitBtn.click();

    // Itt ellenőrizhetjük, hogy a modal még nyitva van-e (nem történt átirányítás)
    const modalHeader = await driver.findElement(By.css('.auth-header h2'));
    expect(await modalHeader.isDisplayed()).toBe(true);
  }, 15000);

  test('5. Váltás Regisztrációs felületre', async () => {
    await driver.get(baseUrl);
    await driver.wait(until.elementLocated(By.css('.btn-login')), 10000).click();
    
    const registerLink = await driver.wait(until.elementLocated(By.xpath("//span[contains(text(), 'Regisztrálj most')]")), 5000);
    await registerLink.click();
    
    // Várjuk meg, amíg a fejléc szövege megváltozik
    const titleElement = await driver.wait(until.elementLocated(By.css('.auth-header h2')), 5000);
    const titleText = await titleElement.getText();
    
    expect(titleText.toLowerCase()).toContain('fiók');
  }, 15000);
});