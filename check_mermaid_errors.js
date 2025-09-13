const { chromium } = require('playwright');

async function checkMermaidErrors() {
  let browser;
  let page;
  
  try {
    console.log('Запуск браузера для проверки Mermaid...');
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    page = await context.newPage();

    // Перехватываем все консольные сообщения
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type,
        text: msg.text(),
        location: msg.location()
      });
    });

    console.log('Переход на страницу документации...');
    await page.goto('http://localhost:3000/docs/atr_fb_zadanie', { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });

    // Ждем немного для полной загрузки всех скриптов
    await page.waitForTimeout(3000);

    console.log('\n=== КОНСОЛЬНЫЕ СООБЩЕНИЯ ===');
    const mermaidErrors = consoleMessages.filter(msg => 
      msg.text.includes('mermaid') || 
      msg.text.includes('Mermaid') ||
      msg.type() === 'error'
    );

    if (mermaidErrors.length > 0) {
      console.log('Найдены ошибки, связанные с Mermaid:');
      mermaidErrors.forEach((msg, index) => {
        console.log(`\n${index + 1}. [${msg.type().toUpperCase()}] ${msg.text}`);
        if (msg.location.url) {
          console.log(`   Источник: ${msg.location.url}:${msg.location.lineNumber}`);
        }
      });
    } else {
      console.log('✅ Ошибок, связанных с Mermaid, не обнаружено');
    }

    // Проверяем общие ошибки
    const generalErrors = consoleMessages.filter(msg => msg.type() === 'error');
    if (generalErrors.length > 0) {
      console.log('\n=== ОБЩИЕ ОШИБКИ ===');
      generalErrors.forEach((msg, index) => {
        console.log(`\n${index + 1}. ${msg.text}`);
        if (msg.location.url) {
          console.log(`   Источник: ${msg.location.url}:${msg.location.lineNumber}`);
        }
      });
    } else {
      console.log('\n✅ Общих ошибок не обнаружено');
    }

    console.log(`\nВсего сообщений в консоли: ${consoleMessages.length}`);

  } catch (error) {
    console.error('Ошибка при проверке Mermaid:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

checkMermaidErrors();