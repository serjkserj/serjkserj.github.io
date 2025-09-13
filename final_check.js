const { chromium } = require('playwright');

async function checkPageWithMermaid(url, pageName) {
  let browser;
  let page;
  
  try {
    console.log(`\n=== ПРОВЕРКА ${pageName.toUpperCase()} ===`);
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    page = await context.newPage();

    // Перехват консольных ошибок
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

    console.log(`Переход на страницу: ${url}`);
    const response = await page.goto(url, { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });

    // Проверяем статус ответа
    if (response.status() >= 400) {
      console.log(`❌ Ошибка загрузки страницы: статус ${response.status()}`);
      return { success: false, status: response.status() };
    }

    console.log('✅ Страница загружена успешно');

    // Ждем для полной загрузки Mermaid диаграмм
    await page.waitForTimeout(3000);

    // Проверяем наличие Mermaid диаграмм на странице
    const mermaidElements = await page.$$('.mermaid');
    console.log(`Найдено Mermaid диаграмм: ${mermaidElements.length}`);

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

    // Получаем информацию о странице
    const title = await page.title();
    const currentUrl = await page.url();
    
    console.log('\n=== ИНФОРМАЦИЯ О СТРАНИЦЕ ===');
    console.log('URL:', currentUrl);
    console.log('Title:', title);

    return {
      success: true,
      url: currentUrl,
      title,
      mermaidCount: mermaidElements.length,
      errors: errors.length,
      mermaidErrors: errors.filter(e => e.text.toLowerCase().includes('mermaid')).length
    };

  } catch (error) {
    console.error(`Ошибка при проверке ${pageName}:`, error.message);
    return { success: false, error: error.message };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function finalCheck() {
  console.log('🚀 ЗАПУСК ФИНАЛЬНОЙ ПРОВЕРКИ Docusaurus\n');
  
  const pages = [
    { url: 'http://localhost:3000/docs/atr_fb_zadanie', name: 'Основная документация' },
    { url: 'http://localhost:3000/docs/atr_fb_zadanie_new', name: 'Новая версия документации' }
  ];

  const results = [];
  
  for (const page of pages) {
    const result = await checkPageWithMermaid(page.url, page.name);
    results.push({ ...page, ...result });
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 ИТОГИ ПРОВЕРКИ');
  console.log('='.repeat(50));
  
  results.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.name}`);
    console.log(`   ✅ Статус: ${result.success ? 'Успешно' : 'Ошибка'}`);
    if (result.success) {
      console.log(`   📄 Mermaid диаграмм: ${result.mermaidCount}`);
      console.log(`   ❌ Всего ошибок: ${result.errors}`);
      console.log(`   🚫 Ошибок Mermaid: ${result.mermaidErrors}`);
      console.log(`   🔗 URL: ${result.url}`);
    } else {
      console.log(`   💥 Ошибка: ${result.error || 'Неизвестная ошибка'}`);
    }
  });

  // Проверяем наличие скриншота
  const fs = require('fs');
  const screenshotExists = fs.existsSync('docs_screenshot.png');
  console.log(`\n📸 Скриншот создан: ${screenshotExists ? '✅ Да' : '❌ Нет'}`);
  
  if (screenshotExists) {
    const stats = fs.statSync('docs_screenshot.png');
    console.log(`   Размер: ${(stats.size / 1024).toFixed(2)} KB`);
  }
}

finalCheck();