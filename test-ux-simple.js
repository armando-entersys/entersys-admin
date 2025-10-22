// Script simple para pruebas de UX usando chrome-devtools-mcp
// Este script debe ejecutarse mientras chrome-devtools-mcp está corriendo

const APP_URL = 'http://localhost:5174';

console.log('🚀 Iniciando pruebas de UX...');
console.log('📝 Páginas a probar:');
console.log('   1. Login: /login');
console.log('   2. Dashboard: /dashboard');
console.log('   3. Posts List: /posts');
console.log('   4. Create Post: /posts/new');
console.log('');
console.log('💡 Instrucciones:');
console.log('   1. Chrome DevTools MCP debe estar corriendo');
console.log('   2. Abre Chrome y navega manualmente a cada URL');
console.log('   3. Usa las DevTools para:');
console.log('      - Inspeccionar elementos');
console.log('      - Verificar responsive design');
console.log('      - Revisar console para errores');
console.log('      - Tomar screenshots');
console.log('');
console.log('🔗 URLs a probar:');
console.log(`   ${APP_URL}/login`);
console.log(`   ${APP_URL}/dashboard`);
console.log(`   ${APP_URL}/posts`);
console.log(`   ${APP_URL}/posts/new`);
console.log('');
console.log('✅ ¡Listo para comenzar las pruebas manuales!');
