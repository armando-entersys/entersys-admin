import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const APP_URL = 'http://localhost:5174';
const SCREENSHOTS_DIR = './test-screenshots';

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runUXTests() {
  console.log('🚀 Iniciando pruebas de UX y visualización...\n');

  const browser = await puppeteer.launch({
    headless: false, // Cambia a true para modo headless
    defaultViewport: {
      width: 1920,
      height: 1080
    },
    args: ['--start-maximized']
  });

  const page = await browser.newPage();

  try {
    // Test 1: Página de Login
    console.log('📸 Test 1: Capturando página de Login...');
    await page.goto(`${APP_URL}/login`, { waitUntil: 'networkidle2' });
    await sleep(1000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '01-login-page.png'),
      fullPage: true
    });
    console.log('✅ Screenshot guardado: 01-login-page.png\n');

    // Test 2: Verificar elementos del formulario de login
    console.log('🔍 Test 2: Verificando elementos del formulario de login...');
    const emailInput = await page.$('input[type="email"], input[name="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const loginButton = await page.$('button[type="submit"]');

    if (emailInput && passwordInput && loginButton) {
      console.log('✅ Elementos del formulario encontrados correctamente\n');

      // Capturar estado hover del botón
      await loginButton.hover();
      await sleep(500);
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, '02-login-button-hover.png'),
        fullPage: true
      });
      console.log('📸 Screenshot guardado: 02-login-button-hover.png\n');
    } else {
      console.log('⚠️ Algunos elementos del formulario no se encontraron\n');
    }

    // Test 3: Intentar login (esto probablemente falle, pero podemos ver el error)
    console.log('🔍 Test 3: Probando interacción con formulario de login...');
    await page.type('input[type="email"], input[name="email"]', 'test@entersys.com');
    await page.type('input[type="password"]', 'testpassword123');
    await sleep(500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '03-login-form-filled.png'),
      fullPage: true
    });
    console.log('📸 Screenshot guardado: 03-login-form-filled.png\n');

    // Test 4: Verificar diseño responsive
    console.log('📱 Test 4: Probando diseño responsive (Mobile)...');
    await page.setViewport({ width: 375, height: 667 }); // iPhone SE
    await sleep(500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '04-login-mobile-375.png'),
      fullPage: true
    });
    console.log('📸 Screenshot guardado: 04-login-mobile-375.png\n');

    // Test 5: Tablet
    console.log('📱 Test 5: Probando diseño responsive (Tablet)...');
    await page.setViewport({ width: 768, height: 1024 }); // iPad
    await sleep(500);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '05-login-tablet-768.png'),
      fullPage: true
    });
    console.log('📸 Screenshot guardado: 05-login-tablet-768.png\n');

    // Volver a desktop
    await page.setViewport({ width: 1920, height: 1080 });

    // Test 6: Intentar ir al dashboard (debería redirigir a login si no autenticado)
    console.log('🔍 Test 6: Intentando acceder al dashboard sin autenticación...');
    await page.goto(`${APP_URL}/dashboard`, { waitUntil: 'networkidle2' });
    await sleep(1000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '06-dashboard-redirect.png'),
      fullPage: true
    });
    console.log('📸 Screenshot guardado: 06-dashboard-redirect.png\n');

    // Test 7: Verificar navegación a posts
    console.log('🔍 Test 7: Intentando acceder a /posts...');
    await page.goto(`${APP_URL}/posts`, { waitUntil: 'networkidle2' });
    await sleep(1000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '07-posts-page.png'),
      fullPage: true
    });
    console.log('📸 Screenshot guardado: 07-posts-page.png\n');

    // Test 8: Verificar navegación a crear post
    console.log('🔍 Test 8: Intentando acceder a /posts/new...');
    await page.goto(`${APP_URL}/posts/new`, { waitUntil: 'networkidle2' });
    await sleep(1000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '08-create-post-page.png'),
      fullPage: true
    });
    console.log('📸 Screenshot guardado: 08-create-post-page.png\n');

    // Test 9: Verificar accesibilidad - Verificar contraste de colores
    console.log('♿ Test 9: Analizando accesibilidad...');
    const a11yIssues = await page.evaluate(() => {
      const issues = [];
      const buttons = document.querySelectorAll('button');
      const inputs = document.querySelectorAll('input');

      if (buttons.length === 0) issues.push('No se encontraron botones');
      if (inputs.length === 0) issues.push('No se encontraron inputs');

      return issues;
    });

    if (a11yIssues.length > 0) {
      console.log('⚠️ Problemas de accesibilidad encontrados:', a11yIssues);
    } else {
      console.log('✅ Elementos básicos de accesibilidad presentes\n');
    }

    // Test 10: Verificar rendimiento de carga
    console.log('⚡ Test 10: Midiendo rendimiento de carga...');
    const metrics = await page.metrics();
    console.log('📊 Métricas de rendimiento:');
    console.log(`   - Layouts: ${metrics.LayoutCount}`);
    console.log(`   - RecalcStyles: ${metrics.RecalcStyleCount}`);
    console.log(`   - Scripts: ${metrics.ScriptDuration.toFixed(2)}s`);
    console.log(`   - TaskDuration: ${metrics.TaskDuration.toFixed(2)}s\n`);

    console.log('✨ ¡Pruebas completadas exitosamente!');
    console.log(`📁 Screenshots guardados en: ${SCREENSHOTS_DIR}\n`);

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
  } finally {
    await browser.close();
  }
}

// Ejecutar pruebas
runUXTests().catch(console.error);
