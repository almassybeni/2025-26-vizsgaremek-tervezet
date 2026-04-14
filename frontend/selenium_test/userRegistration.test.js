const { Builder, By, until } = require('selenium-webdriver');
const edge = require('selenium-webdriver/edge');

// Globális Jest timeout növelése a Selenium lassúsága miatt
jest.setTimeout(60000);

describe('Felhasználói Regisztráció Tesztek (Selenium)', () => {
  let driver;
  const baseUrl = 'http://localhost:5173';

  beforeAll(async () => {
    console.log('[SETUP] Böngésző indítása regisztrációs tesztekhez...');
    const options = new edge.Options();
    options.addArguments('--remote-allow-origins=*');
    options.addArguments('--start-maximized');
    options.addArguments('--disable-blink-features=AutomationControlled'); // Automatizálás jelző elrejtése

    driver = await new Builder()
      .forBrowser('MicrosoftEdge')
      .setEdgeOptions(options)
      .build();
    console.log('[SETUP] Böngésző készen áll regisztrációs tesztekhez.');
  }, 30000);

  afterAll(async () => {
    if (driver) await driver.quit();
    console.log('[TEARDOWN] Böngésző bezárva regisztrációs tesztek után.');
  });

  test('1. Sikeres felhasználói regisztráció', async () => {
    console.log('[TEST] Sikeres regisztráció tesztelése...');
    await driver.get(baseUrl);
    await driver.wait(until.elementLocated(By.className('profile-trigger')), 10000).click();
    const registerBtn = await driver.wait(until.elementLocated(By.xpath("//div[@class='profile-dropdown']//div[text()='Regisztráció']")), 5000);
    await registerBtn.click();

    // Itt feltételezzük, hogy az inputok id-ja hasonló a LoginPage-hez
    const usernameField = await driver.wait(until.elementLocated(By.css('.register-form #name')), 10000);
    await usernameField.sendKeys('testuser' + Date.now()); // Egyedi felhasználónév generálása
    
    const emailField = await driver.findElement(By.id('email'));
    await emailField.sendKeys('testuser' + Date.now() + '@example.com'); // Egyedi email generálása

    const passwordField = await driver.findElement(By.id('password'));
    await passwordField.sendKeys('Password123!');

    const passwordConfirmField = await driver.findElement(By.id('passwordConfirm'));
    await passwordConfirmField.sendKeys('Password123!');

    const submitBtn = await driver.findElement(By.className('register-button'));
    await submitBtn.click();

    // A RegisterPage.jsx szerint sikeres regisztráció után a /profile-ra megyünk
    await driver.wait(until.urlContains('/profile'), 20000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain('profile');
    console.log('[TEST] Sikeres regisztráció: átirányítás a profil oldalra.');
  }, 30000);

  test('2. Sikertelen regisztráció - jelszó egyezés hiánya', async () => {
    console.log('[TEST] Sikertelen regisztráció tesztelése (jelszó egyezés hiánya)...');
    // Közvetlen navigáció, hogy elkerüljük a profil dropdown problémákat
    await driver.get(`${baseUrl}/register`); 

    await driver.wait(until.elementLocated(By.id('name')), 10000).sendKeys('anotheruser' + Date.now());
    await driver.findElement(By.id('email')).sendKeys('anotheruser' + Date.now() + '@example.com');
    await driver.findElement(By.id('password')).sendKeys('Password123!');
    await driver.findElement(By.id('passwordConfirm')).sendKeys('DifferentPassword123!');
    
    const submitBtn = await driver.findElement(By.className('register-button'));
    await submitBtn.click();

    const errorMsg = await driver.wait(until.elementLocated(By.className('error-message')), 10000);
    expect(await errorMsg.isDisplayed()).toBe(true);
    expect(await errorMsg.getText()).toBeDefined();
    console.log('[TEST] Sikertelen regisztráció: hibaüzenet ellenőrizve.');
  }, 30000);

  test('3. Sikertelen regisztráció - üres mezők', async () => {
    console.log('[TEST] Sikertelen regisztráció tesztelése (üres mezők)...');
    // Közvetlen navigáció
    await driver.get(`${baseUrl}/register`);

    const submitBtn = await driver.wait(until.elementLocated(By.className('register-button')), 10000);
    await submitBtn.click();

    const usernameInput = await driver.findElement(By.id('name'));
    const isRequired = await usernameInput.getAttribute('required');
    expect(isRequired).toBe('true'); // Feltételezzük, hogy a mező kötelező
    console.log('[TEST] Sikertelen regisztráció: üres mezők validációja ellenőrizve.');
  }, 20000);
});