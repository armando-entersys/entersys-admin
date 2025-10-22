import puppeteer from 'puppeteer';

async function checkScram() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();

  try {
    console.log('Navegando...');
    await page.goto('https://admin-dev.scram2k.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    await page.waitForTimeout(5000);

    // Tomar screenshot del login
    await page.screenshot({ path: 'scram-login.png', fullPage: true });
    console.log('Screenshot guardado: scram-login.png');

    // Extraer estilos CSS completos
    const styles = await page.evaluate(() => {
      const allStyles = [];

      // Get computed styles of body
      const bodyStyles = window.getComputedStyle(document.body);

      // Get all stylesheets
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.cssText) {
              allStyles.push(rule.cssText);
            }
          }
        } catch (e) {
          // Skip CORS stylesheets
        }
      }

      return {
        bodyBg: bodyStyles.backgroundColor,
        bodyFont: bodyStyles.fontFamily,
        allClasses: Array.from(document.querySelectorAll('*'))
          .map(el => el.className)
          .filter(c => c && typeof c === 'string')
          .join(' ')
          .split(' ')
          .filter((v, i, a) => a.indexOf(v) === i)
          .slice(0, 100),
        htmlStructure: document.body.innerHTML.substring(0, 5000)
      };
    });

    console.log('\n=== ANÁLISIS SCRAM ===');
    console.log('Body background:', styles.bodyBg);
    console.log('Body font:', styles.bodyFont);
    console.log('\nClases encontradas (muestra):', styles.allClasses.slice(0, 20));

    console.log('\nPresiona Ctrl+C cuando hayas visto el diseño...');
    await page.waitForTimeout(60000);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

checkScram();
