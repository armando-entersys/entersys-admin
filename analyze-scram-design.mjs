import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const SCRAM_CREDENTIALS = {
  email: 'test.definitivo@scram.com',
  password: 'Test@12345'
};

const OUTPUT_DIR = './scram-design-analysis';

async function analyzeScramDesign() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--start-maximized']
  });

  try {
    const page = await browser.newPage();

    console.log('🔍 Navegando a Scram Admin...');
    await page.goto('https://admin-dev.scram2k.com/', { waitUntil: 'networkidle0' });

    // Screenshot del login
    console.log('📸 Capturando login page...');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '01-login.png'), fullPage: true });

    // Analizar estilos del login
    const loginStyles = await page.evaluate(() => {
      const styles = {
        background: window.getComputedStyle(document.body).background,
        backgroundColor: window.getComputedStyle(document.body).backgroundColor,
        loginCard: null,
        buttons: [],
        inputs: []
      };

      // Analizar card de login
      const card = document.querySelector('[class*="card"], [class*="form"], form');
      if (card) {
        const cs = window.getComputedStyle(card);
        styles.loginCard = {
          background: cs.background,
          backgroundColor: cs.backgroundColor,
          borderRadius: cs.borderRadius,
          boxShadow: cs.boxShadow,
          padding: cs.padding,
          maxWidth: cs.maxWidth
        };
      }

      // Analizar botones
      document.querySelectorAll('button, [type="submit"]').forEach(btn => {
        const cs = window.getComputedStyle(btn);
        styles.buttons.push({
          background: cs.background,
          backgroundColor: cs.backgroundColor,
          color: cs.color,
          borderRadius: cs.borderRadius,
          padding: cs.padding,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          boxShadow: cs.boxShadow,
          border: cs.border,
          transition: cs.transition,
          className: btn.className
        });
      });

      // Analizar inputs
      document.querySelectorAll('input').forEach(input => {
        const cs = window.getComputedStyle(input);
        styles.inputs.push({
          backgroundColor: cs.backgroundColor,
          border: cs.border,
          borderRadius: cs.borderRadius,
          padding: cs.padding,
          fontSize: cs.fontSize,
          height: cs.height,
          className: input.className
        });
      });

      return styles;
    });

    console.log('✍️ Realizando login...');
    await page.waitForSelector('input[type="email"], input[name="email"], input[type="text"]');
    await page.type('input[type="email"], input[name="email"], input[type="text"]', SCRAM_CREDENTIALS.email);
    await page.type('input[type="password"]', SCRAM_CREDENTIALS.password);

    await page.screenshot({ path: path.join(OUTPUT_DIR, '02-login-filled.png') });

    // Click submit
    await Promise.all([
      page.click('button[type="submit"], button:has-text("Iniciar"), button:has-text("Login")'),
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(() => {})
    ]);

    await page.waitForTimeout(3000);

    console.log('📸 Capturando dashboard...');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '03-dashboard.png'), fullPage: true });

    // Analizar estructura del dashboard
    const dashboardStructure = await page.evaluate(() => {
      const structure = {
        sidebar: null,
        topbar: null,
        mainContent: null,
        cards: [],
        colors: []
      };

      // Analizar sidebar
      const sidebar = document.querySelector('[class*="sidebar"], aside, nav[class*="nav"]');
      if (sidebar) {
        const cs = window.getComputedStyle(sidebar);
        structure.sidebar = {
          width: cs.width,
          backgroundColor: cs.backgroundColor,
          background: cs.background,
          color: cs.color,
          padding: cs.padding,
          boxShadow: cs.boxShadow,
          position: cs.position,
          className: sidebar.className,
          html: sidebar.innerHTML.substring(0, 500)
        };
      }

      // Analizar topbar/header
      const header = document.querySelector('header, [class*="topbar"], [class*="navbar"]');
      if (header) {
        const cs = window.getComputedStyle(header);
        structure.topbar = {
          height: cs.height,
          backgroundColor: cs.backgroundColor,
          background: cs.background,
          boxShadow: cs.boxShadow,
          padding: cs.padding,
          className: header.className
        };
      }

      // Analizar cards
      document.querySelectorAll('[class*="card"]').forEach((card, i) => {
        if (i < 5) {
          const cs = window.getComputedStyle(card);
          structure.cards.push({
            backgroundColor: cs.backgroundColor,
            borderRadius: cs.borderRadius,
            boxShadow: cs.boxShadow,
            padding: cs.padding,
            border: cs.border,
            className: card.className
          });
        }
      });

      // Extraer paleta de colores
      const allElements = document.querySelectorAll('*');
      const colors = new Set();
      allElements.forEach(el => {
        const cs = window.getComputedStyle(el);
        if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)') colors.add(cs.backgroundColor);
        if (cs.color !== 'rgba(0, 0, 0, 0)') colors.add(cs.color);
      });
      structure.colors = Array.from(colors).slice(0, 20);

      return structure;
    });

    // Capturar diferentes secciones si existen
    const navigation = await page.evaluate(() => {
      const links = [];
      document.querySelectorAll('nav a, aside a, [class*="sidebar"] a').forEach(link => {
        links.push({
          text: link.textContent.trim(),
          href: link.getAttribute('href')
        });
      });
      return links;
    });

    console.log('📝 Navegación encontrada:', navigation);

    // Intentar navegar a alguna sección
    if (navigation.length > 1) {
      try {
        await page.click('nav a:nth-child(2), aside a:nth-child(2)');
        await page.waitForTimeout(2000);
        await page.screenshot({ path: path.join(OUTPUT_DIR, '04-otra-seccion.png'), fullPage: true });
      } catch (e) {
        console.log('No se pudo navegar a otra sección');
      }
    }

    // Guardar análisis
    const analysis = {
      loginStyles,
      dashboardStructure,
      navigation,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'design-analysis.json'),
      JSON.stringify(analysis, null, 2)
    );

    console.log('✅ Análisis completo guardado en:', OUTPUT_DIR);
    console.log('\n📊 Resumen del diseño:');
    console.log('- Sidebar:', dashboardStructure.sidebar ? '✅' : '❌');
    console.log('- Topbar:', dashboardStructure.topbar ? '✅' : '❌');
    console.log('- Cards encontradas:', dashboardStructure.cards.length);
    console.log('- Colores únicos:', dashboardStructure.colors.length);

  } catch (error) {
    console.error('❌ Error durante el análisis:', error);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'ERROR-screenshot.png') });
  } finally {
    await browser.close();
  }
}

analyzeScramDesign();
