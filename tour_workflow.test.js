const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

/**
 * Selenium End-to-End (E2E) tesztkészlet
 * Vizsgaremek: Magyarország gasztroturizmusa
 * 
 * A teszt lefuttatása előtt:
 * 1. Telepítsd a függőségeket: npm install selenium-webdriver chromedriver
 * 2. Győződj meg róla, hogy a backend és a frontend is fut (alapértelmezett port: 3000).
 */

async function gasztroE2ETest() {
    // Chrome beállítások konfigurálása
    let options = new chrome.Options();
    // options.addArguments('--headless'); // Ha nem akarod, hogy felugorjon a böngésző ablak, vedd ki a kommentet

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        console.log('🚀 Selenium tesztek indítása...');
        
        // Alapértelmezett várakozás (timeout) beállítása a dinamikus elemekhez
        await driver.manage().setTimeouts({ implicit: 5000 });

        // 1. Teszt: Főoldal betöltése
        await driver.get('http://localhost:3000');
        let title = await driver.getTitle();
        console.log(`- Főoldal betöltve, oldal címe: ${title}`);

        // 2. Teszt: Bejelentkezési folyamat
        console.log('- Bejelentkezés tesztelése (Admin adatokkal)...');
        await driver.get('http://localhost:3000/login');
        
        // Mezők kitöltése (feltételezve a 'name' attribútumokat a formban)
        await driver.findElement(By.name('email')).sendKeys('admin@gasztrokalandok.hu');
        await driver.findElement(By.name('password')).sendKeys('admin123', Key.RETURN);

        // Várjuk meg a sikeres bejelentkezést jelző elemet (pl. kijelentkezés gomb)
        await driver.wait(until.elementLocated(By.id('logout-btn')), 10000);
        console.log('✅ Bejelentkezés sikeres.');

        // 3. Teszt: Túrák böngészése és szűrés
        console.log('- Túrák listázása és szűrése...');
        await driver.get('http://localhost:3000/tours');
        
        // Ellenőrizzük a túra kártyák meglétét
        let tourCards = await driver.findElements(By.className('tour-card'));
        console.log(`- Talált túrák száma: ${tourCards.length}`);

        // Régió szűrő tesztelése (pl. Alföld régió kiválasztása)
        let regionFilter = await driver.findElement(By.id('region-filter'));
        await regionFilter.sendKeys('alfold');
        await driver.sleep(1000); // Rövid várakozás a frontend renderelésére
        console.log('✅ Szűrés funkció tesztelve.');

        // 4. Teszt: Túra adatlap megtekintése
        console.log('- Túra adatlap megnyitása...');
        let firstTourLink = await driver.findElement(By.css('.tour-card a.details-link'));
        await firstTourLink.click();

        // Ellenőrizzük, hogy betöltött-e az adatlap (h1 tag ellenőrzése)
        let tourHeader = await driver.wait(until.elementLocated(By.tagName('h1')), 5000);
        let tourTitle = await tourHeader.getText();
        console.log(`✅ Adatlap betöltve: ${tourTitle}`);

        // 5. Teszt: Foglalási szekció ellenőrzése
        let bookingSection = await driver.findElement(By.id('booking-section'));
        console.log(`✅ Foglalási szekció látható: ${await bookingSection.isDisplayed()}`);

        console.log('🎉 Minden Selenium teszt sikeresen lefutott!');

    } catch (error) {
        console.error('❌ Hiba történt a teszt futása során:', error);
    } finally {
        await driver.quit();
    }
}

gasztroE2ETest();