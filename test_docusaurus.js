const { chromium } = require('playwright');

async function testDocusaurus() {
  let browser;
  let page;
  
  try {
    console.log('Запуск браузера...');
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    page = await context.newPage();

    console.log('Переход на страницу документации...');
    await page.goto('http://localhost:3000/docs/atr_fb_zadanie', { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });

    console.log('Создание скриншота...');
    await page.screenshot({ path: 'docs_screenshot.png', fullPage: true });

    // Получаем информацию о странице
    const url = await page.url();
    const title = await page.title();
    
    console.log('Проверка ошибок в консоли...');
    const consoleMessages = await page.evaluate(() => {
      return Array.from(performance.getEntriesByType('resource'))
        .filter(resource => resource.initiatorType === 'script' && resource.responseStatus >= 400)
        .map(resource => ({
          url: resource.name,
          status: resource.responseStatus
        }));
    });

    console.log('\n=== РЕЗУЛЬТАТЫ ===');
    console.log('URL:', url);
    console.log('Title:', title);
    console.log('Screenshot: docs_screenshot.png');
    
    if (consoleMessages.length > 0) {
      console.log('\n=== ОШИБКИ ЗАГРУЗКИ РЕСУРСОВ ===');
      consoleMessages.forEach(msg => {
        console.log(`❌ ${msg.url} - статус: ${msg.status}`);
      });
    } else {
      console.log('\n✅ Ошибок загрузки ресурсов не обнаружено');
    }

    return {
      url,
      title,
      screenshot: 'docs_screenshot.png',
      errors: consoleMessages
    };

  } catch (error) {
    console.error('Ошибка при выполнении теста:', error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Запускаем тест
testDocusaurus()
  .then(result => {
    console.log('\n✅ Тест завершен успешно!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Тест завершен с ошибкой:', error.message);
    process.exit(1);
  });