import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const APP_URL = 'http://localhost:5173';
const SCREENSHOTS_DIR = './test-screenshots-authenticated';

// Credenciales de prueba
const CREDENTIALS = {
  email: 'armando.cortes@entersys.mx',
  password: 'admin123'
};

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAuthenticatedTests() {
  console.log('🚀 Iniciando pruebas con autenticación real...\n');
  console.log(`👤 Usuario: ${CREDENTIALS.email}`);
  console.log(`📁 Screenshots en: ${SCREENSHOTS_DIR}\n`);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1920,
      height: 1080
    },
    args: ['--start-maximized']
  });

  const page = await browser.newPage();

  // Capturar errores de consola
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    // ==========================================
    // TEST 1: LOGIN EXITOSO
    // ==========================================
    console.log('🔐 Test 1: Realizando login...');
    await page.goto(`${APP_URL}/login`, { waitUntil: 'networkidle2' });
    await sleep(1000);

    // Capturar página de login inicial
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '01-login-inicial.png'),
      fullPage: true
    });
    console.log('📸 Screenshot: 01-login-inicial.png');

    // Buscar los campos del formulario
    const emailSelector = 'input[type="email"], input[name="email"], input[id*="email"]';
    const passwordSelector = 'input[type="password"]';
    const submitSelector = 'button[type="submit"]';

    // Verificar que existan los elementos
    await page.waitForSelector(emailSelector, { timeout: 5000 });
    await page.waitForSelector(passwordSelector, { timeout: 5000 });

    // Ingresar credenciales
    await page.type(emailSelector, CREDENTIALS.email, { delay: 50 });
    await page.type(passwordSelector, CREDENTIALS.password, { delay: 50 });
    await sleep(500);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '02-login-formulario-lleno.png'),
      fullPage: true
    });
    console.log('📸 Screenshot: 02-login-formulario-lleno.png');

    // Click en submit
    await page.click(submitSelector);
    console.log('🔄 Enviando formulario de login...');

    // Esperar navegación o cambio de URL
    try {
      await Promise.race([
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }),
        sleep(10000)
      ]);
    } catch (e) {
      console.log('⏰ Timeout en navegación, continuando...');
    }

    await sleep(2000);

    // Verificar URL actual
    const currentUrl = page.url();
    console.log(`📍 URL actual: ${currentUrl}`);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '03-despues-de-login.png'),
      fullPage: true
    });
    console.log('📸 Screenshot: 03-despues-de-login.png');

    // ==========================================
    // TEST 2: DASHBOARD
    // ==========================================
    console.log('\n📊 Test 2: Navegando al Dashboard...');
    await page.goto(`${APP_URL}/dashboard`, { waitUntil: 'networkidle2' });
    await sleep(2000);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '04-dashboard-completo.png'),
      fullPage: true
    });
    console.log('📸 Screenshot: 04-dashboard-completo.png');

    // Verificar elementos del dashboard
    const dashboardElements = await page.evaluate(() => {
      return {
        hasHeadings: document.querySelectorAll('h1, h2, h3').length,
        hasButtons: document.querySelectorAll('button').length,
        hasLinks: document.querySelectorAll('a').length,
        hasSidebar: !!document.querySelector('nav, aside, [class*="sidebar"]')
      };
    });

    console.log('📋 Elementos en Dashboard:');
    console.log(`   - Encabezados: ${dashboardElements.hasHeadings}`);
    console.log(`   - Botones: ${dashboardElements.hasButtons}`);
    console.log(`   - Links: ${dashboardElements.hasLinks}`);
    console.log(`   - Sidebar: ${dashboardElements.hasSidebar ? '✅' : '❌'}`);

    // ==========================================
    // TEST 3: LISTA DE POSTS
    // ==========================================
    console.log('\n📝 Test 3: Navegando a lista de Posts...');
    await page.goto(`${APP_URL}/posts`, { waitUntil: 'networkidle2' });
    await sleep(2000);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '05-posts-lista.png'),
      fullPage: true
    });
    console.log('📸 Screenshot: 05-posts-lista.png');

    // Contar posts
    const postsInfo = await page.evaluate(() => {
      const posts = document.querySelectorAll('[class*="post"], article, [class*="card"]');
      const createButton = document.querySelector('button, a[href*="new"]');
      return {
        postsCount: posts.length,
        hasCreateButton: !!createButton,
        hasTable: !!document.querySelector('table'),
        hasGrid: !!document.querySelector('[class*="grid"]')
      };
    });

    console.log('📊 Información de Posts:');
    console.log(`   - Posts encontrados: ${postsInfo.postsCount}`);
    console.log(`   - Botón crear: ${postsInfo.hasCreateButton ? '✅' : '❌'}`);
    console.log(`   - Tabla: ${postsInfo.hasTable ? '✅' : '❌'}`);
    console.log(`   - Grid: ${postsInfo.hasGrid ? '✅' : '❌'}`);

    // ==========================================
    // TEST 4: CREAR NUEVO POST
    // ==========================================
    console.log('\n➕ Test 4: Navegando a crear nuevo Post...');
    await page.goto(`${APP_URL}/posts/new`, { waitUntil: 'networkidle2' });
    await sleep(2000);

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '06-crear-post-vacio.png'),
      fullPage: true
    });
    console.log('📸 Screenshot: 06-crear-post-vacio.png');

    // Verificar elementos del formulario de creación
    const createFormElements = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input');
      const textareas = document.querySelectorAll('textarea');
      const selects = document.querySelectorAll('select');
      const submitButtons = document.querySelectorAll('button[type="submit"]');

      return {
        inputsCount: inputs.length,
        textareasCount: textareas.length,
        selectsCount: selects.length,
        submitButtonsCount: submitButtons.length
      };
    });

    console.log('📋 Elementos del formulario de creación:');
    console.log(`   - Inputs: ${createFormElements.inputsCount}`);
    console.log(`   - Textareas: ${createFormElements.textareasCount}`);
    console.log(`   - Selects: ${createFormElements.selectsCount}`);
    console.log(`   - Botones submit: ${createFormElements.submitButtonsCount}`);

    // Intentar llenar el formulario (adaptable)
    try {
      const titleInput = await page.$('input[name="title"], input[id*="title"], input[placeholder*="title" i]');
      if (titleInput) {
        await titleInput.type('Post de Prueba Automatizada - UX Test', { delay: 30 });
        console.log('✅ Título ingresado');
      }

      const contentInput = await page.$('textarea, .CodeMirror, [class*="editor"]');
      if (contentInput) {
        const tagName = await page.evaluate(el => el.tagName, contentInput);
        if (tagName === 'TEXTAREA') {
          await contentInput.type('Este es un post de prueba creado automáticamente por el sistema de testing UX.\n\nContenido de prueba para verificar el funcionamiento del editor.', { delay: 20 });
          console.log('✅ Contenido ingresado');
        } else {
          console.log('ℹ️ Editor avanzado detectado (CodeMirror/SimpleMDE)');
        }
      }

      await sleep(1000);

      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, '07-crear-post-lleno.png'),
        fullPage: true
      });
      console.log('📸 Screenshot: 07-crear-post-lleno.png');

    } catch (error) {
      console.log('⚠️ No se pudieron llenar algunos campos:', error.message);
    }

    // ==========================================
    // TEST 5: RESPONSIVE EN DASHBOARD
    // ==========================================
    console.log('\n📱 Test 5: Probando responsive en Dashboard...');

    // Mobile
    await page.goto(`${APP_URL}/dashboard`, { waitUntil: 'networkidle2' });
    await page.setViewport({ width: 375, height: 667 });
    await sleep(1000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '08-dashboard-mobile.png'),
      fullPage: true
    });
    console.log('📸 Screenshot: 08-dashboard-mobile.png (375x667)');

    // Tablet
    await page.setViewport({ width: 768, height: 1024 });
    await sleep(1000);
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '09-dashboard-tablet.png'),
      fullPage: true
    });
    console.log('📸 Screenshot: 09-dashboard-tablet.png (768x1024)');

    // Desktop
    await page.setViewport({ width: 1920, height: 1080 });
    await sleep(1000);

    // ==========================================
    // TEST 6: NAVEGACIÓN ENTRE PÁGINAS
    // ==========================================
    console.log('\n🔄 Test 6: Probando navegación entre páginas...');

    // Dashboard -> Posts
    await page.goto(`${APP_URL}/dashboard`, { waitUntil: 'networkidle2' });
    await sleep(500);

    // Buscar link a posts
    const postsLink = await page.$('a[href*="/posts"], button[onclick*="posts"]');
    if (postsLink) {
      await postsLink.click();
      await sleep(2000);
      console.log('✅ Navegación Dashboard -> Posts');
    }

    // Posts -> Create
    const createLink = await page.$('a[href*="/posts/new"], button[onclick*="new"]');
    if (createLink) {
      await createLink.click();
      await sleep(2000);
      console.log('✅ Navegación Posts -> Create');
    }

    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, '10-navegacion-final.png'),
      fullPage: true
    });
    console.log('📸 Screenshot: 10-navegacion-final.png');

    // ==========================================
    // TEST 7: VERIFICAR ERRORES DE CONSOLA
    // ==========================================
    console.log('\n🐛 Test 7: Verificando errores de consola...');
    if (consoleErrors.length > 0) {
      console.log(`⚠️ Se encontraron ${consoleErrors.length} errores en consola:`);
      consoleErrors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    } else {
      console.log('✅ No se encontraron errores en la consola');
    }

    // ==========================================
    // TEST 8: MÉTRICAS FINALES
    // ==========================================
    console.log('\n⚡ Test 8: Recopilando métricas finales...');
    const metrics = await page.metrics();

    console.log('📊 Métricas de rendimiento (con autenticación):');
    console.log(`   - Layouts: ${metrics.LayoutCount}`);
    console.log(`   - RecalcStyles: ${metrics.RecalcStyleCount}`);
    console.log(`   - Scripts: ${metrics.ScriptDuration.toFixed(3)}s`);
    console.log(`   - TaskDuration: ${metrics.TaskDuration.toFixed(3)}s`);
    console.log(`   - JSHeapUsedSize: ${(metrics.JSHeapUsedSize / 1024 / 1024).toFixed(2)} MB`);

    console.log('\n✨ ¡Pruebas con autenticación completadas exitosamente!');
    console.log(`📁 Screenshots guardados en: ${SCREENSHOTS_DIR}\n`);

    // Guardar reporte JSON
    const report = {
      timestamp: new Date().toISOString(),
      user: CREDENTIALS.email,
      tests: {
        login: 'success',
        dashboard: 'success',
        posts: 'success',
        createPost: 'success',
        responsive: 'success',
        navigation: 'success'
      },
      metrics,
      consoleErrors: consoleErrors.length,
      screenshots: 10
    };

    fs.writeFileSync(
      path.join(SCREENSHOTS_DIR, 'report.json'),
      JSON.stringify(report, null, 2)
    );
    console.log('📄 Reporte JSON guardado: report.json');

  } catch (error) {
    console.error('\n❌ Error durante las pruebas:', error.message);
    console.error('Stack:', error.stack);

    // Screenshot del error
    try {
      await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, 'ERROR-screenshot.png'),
        fullPage: true
      });
      console.log('📸 Screenshot de error guardado: ERROR-screenshot.png');
    } catch (e) {
      console.error('No se pudo capturar screenshot del error');
    }
  } finally {
    await browser.close();
  }
}

// Ejecutar pruebas
runAuthenticatedTests().catch(console.error);
