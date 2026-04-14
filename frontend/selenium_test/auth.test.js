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
    await driver.wait(until.elementLocated(By.className('profile-trigger')), 10000).click();
    const loginBtn = await driver.wait(until.elementLocated(By.xpath("//div[@class='profile-dropdown']//div[text()='Bejelentkezés']")), 5000);
    await loginBtn.click();

    const emailInput = await driver.wait(until.elementLocated(By.id('email')), 10000);
    await emailInput.sendKeys('admin@gasztrokalandok.hu');
    
    const passwordInput = await driver.findElement(By.id('password'));
    await passwordInput.sendKeys('admin123');
    
    await driver.findElement(By.className('login-button')).click();

    // Ellenőrizzük a bejelentkezés sikerességét
    await driver.wait(async () => {
      return await driver.executeScript("return localStorage.getItem('token') !== null");
    }, 10000);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain('/profile');
  }, 20000);

  test('2. Kijelentkezés folyamata', async () => {
    await driver.get(baseUrl);
    const profilDropdown = await driver.wait(until.elementLocated(By.className('profile-trigger')), 10000);
    await profilDropdown.click();
    
    const logoutBtn = await driver.wait(until.elementLocated(By.xpath("//div[@class='profile-dropdown']//div[text()='Kijelentkezés']")), 5000);
    await logoutBtn.click();

    // SweetAlert2 vagy confirm modal kezelése
    try {
      const confirmBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(translate(text(), 'IGEN', 'igen'), 'igen') or contains(@class, 'swal2-confirm')]")), 5000);
      await confirmBtn.click();
    } catch (e) {
      console.log("Nem volt szükség megerősítő gombra vagy nem található.");
    }

    // Ellenőrizzük, hogy újra látható-e a bejelentkezés gomb
    const loginBtn = await driver.wait(until.elementLocated(By.className('profile-trigger')), 10000);
    expect(await loginBtn.isDisplayed()).toBe(true);
  }, 20000);

  test('3. Sikertelen bejelentkezés (Rossz jelszó)', async () => {
    await driver.get(baseUrl);
    await driver.wait(until.elementLocated(By.className('profile-trigger')), 10000).click();
    await driver.wait(until.elementLocated(By.xpath("//div[@class='profile-dropdown']//div[text()='Bejelentkezés']")), 5000).click();
    
    const emailInput = await driver.wait(until.elementLocated(By.id('email')), 5000);
    await emailInput.sendKeys('admin@gasztrokalandok.hu');
    await driver.findElement(By.id('password')).sendKeys('rosszjelszo123');
    await driver.findElement(By.className('login-button')).click();
    
    const errorMsg = await driver.wait(until.elementLocated(By.className('error-message')), 5000);
    expect(await errorMsg.isDisplayed()).toBe(true);
  }, 15000);

  test('4. Bejelentkezés hibás email formátummal', async () => {
    await driver.get(baseUrl);
    await driver.wait(until.elementLocated(By.className('profile-trigger')), 10000).click();
    await driver.wait(until.elementLocated(By.xpath("//div[@class='profile-dropdown']//div[text()='Bejelentkezés']")), 5000).click();
    
    const emailInput = await driver.wait(until.elementLocated(By.id('email')), 5000);
    await emailInput.sendKeys('hibasemailformatum');
    await driver.findElement(By.id('password')).sendKeys('admin123');
    
    const submitBtn = await driver.findElement(By.className('login-button'));
    await submitBtn.click();

    // Itt ellenőrizhetjük, hogy a modal még nyitva van-e (nem történt átirányítás)
    expect(await driver.getCurrentUrl()).toContain('/login');
  }, 15000);

  test('5. Váltás Regisztrációs felületre', async () => {
    await driver.get(baseUrl);
    await driver.wait(until.elementLocated(By.className('profile-trigger')), 10000).click();
    await driver.wait(until.elementLocated(By.xpath("//div[@class='profile-dropdown']//div[text()='Bejelentkezés']")), 5000).click();
    
    const registerLink = await driver.wait(until.elementLocated(By.xpath("//a[text()='Regisztráció']")), 5000);
    await registerLink.click();
    
    // Várjuk meg, amíg a fejléc szövege megváltozik
    const header = await driver.wait(until.elementLocated(By.css('.register-header h1')), 5000);
    expect(await header.getText()).toContain('Regisztráció');
  }, 15000);
});