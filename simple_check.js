const { chromium } = require('playwright');

async function simpleCheck() {
  let browser;
  let page;
  
  try {
    console.log('Запуск браузера для простой проверки...');
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    page = await context.newPage();

    // Простой перехват консольных ошибок
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push({
          text: msg.text(),
          url: msg.location().url,
          line: msg.location().lineNumber
        });
      }
    });

    console.log('Переход на страницу документации...');
    const response = await page.goto('http://localhost:3000/docs/atr_fb_zadanie', { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });

    // Проверяем статус ответа
    if (response.status() >= 400) {
      console.log(`❌ Ошибка загрузки страницы: статус ${response.status()}`);
    } else {
      console.log('✅ Страница загружена успешно');
    }

    // Ждем немного для полной загрузки
    await page.waitForTimeout(2000);

    console.log('\n=== ОШИБКИ В КОНСОЛИ ===');
    if (errors.length > 0) {
      console.log(`Найдено ${errors.length} ошибок:`);
      errors.forEach((error, index) => {
        console.log(`\n${index + 1}. ${error.text}`);
        if (error.url) {
          console.log(`   Источник: ${error.url}:${error.line}`);
        }
      });
      
      // Проверяем ошибки Mermaid
      const mermaidErrors = errors.filter(error => 
        error.text.toLowerCase().includes('mermaid')
      );
      if (mermaidErrors.length > 0) {
        console.log('\n=== ОШИБКИ MERMAID ===');
        mermaidErrors.forEach((error, index) => {
          console.log(`\n${index + 1}. ${error.text}`);
        });
      } else {
        console.log('\n✅ Ошибок Mermaid не обнаружено');
      }
    } else {
      console.log('✅ Ошибок в консоли не обнаружено');
    }

    // Проверяем заголовок и URL
    const title = await page.title();
    const url = await page.url();
    console.log('\n=== ИНФОРМАЦИЯ О СТРАНИЦЕ ===');
    console.log('URL:', url);
    console.log('Title:', title);

  } catch (error) {
    console.error('Ошибка при проверке:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

simpleCheck();