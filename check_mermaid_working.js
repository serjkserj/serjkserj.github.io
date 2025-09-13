const { chromium } = require('playwright');

async function checkMermaidWorking() {
  let browser;
  let page;
  
  try {
    console.log('🚀 Проверка работы Mermaid диаграмм после обновления конфигурации');
    browser = await chromium.launch({ headless: false });
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

    console.log('Переход на страницу с Mermaid диаграммами...');
    const response = await page.goto('http://localhost:3000/docs/atr_fb_zadanie_new', { 
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
    console.log('Ожидание загрузки Mermaid диаграмм...');
    await page.waitForTimeout(5000);

    // Проверяем наличие Mermaid диаграмм на странице
    const mermaidContainers = await page.$$('.mermaid');
    console.log(`Найдено Mermaid контейнеров: ${mermaidContainers.length}`);

    // Проверяем, есть ли SVG элементы внутри контейнеров
    let svgElementsCount = 0;
    for (const container of mermaidContainers) {
      const svgInside = await container.$$('svg');
      svgElementsCount += svgInside.length;
    }

    console.log(`Найдено SVG элементов в диаграммах: ${svgElementsCount}`);

    // Делаем скриншот для проверки
    console.log('Создание скриншота...');
    await page.screenshot({ path: 'verification_mermaid_success.png', fullPage: true });

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

    console.log('\n=== РЕЗУЛЬТАТЫ ПРОВЕРКИ MERMAID ===');
    if (svgElementsCount > 0) {
      console.log(`✅ УСПЕХ: Mermaid диаграммы работают! Найдено ${svgElementsCount} SVG элементов`);
    } else {
      console.log('❌ ПРЕДУПРЕЖДЕНИЕ: Mermaid диаграммы не отображаются как SVG элементы');
      console.log('   Это может быть связано с:');
      console.log('   - Временем загрузки (нужно больше времени)');
      console.log('   - Проблемами с конфигурацией Mermaid');
      console.log('   - Особенностями рендеринга Docusaurus');
    }

    return {
      success: true,
      url: currentUrl,
      title,
      mermaidContainers: mermaidContainers.length,
      svgElements: svgElementsCount,
      errors: errors.length,
      mermaidErrors: errors.filter(e => e.text.toLowerCase().includes('mermaid')).length
    };

  } catch (error) {
    console.error('Ошибка при проверке Mermaid:', error.message);
    return { success: false, error: error.message };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Запускаем проверку
checkMermaidWorking()
  .then(result => {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 ФИНАЛЬНЫЙ РЕЗУЛЬТАТ ПРОВЕРКИ');
    console.log('='.repeat(60));
    
    if (result.success) {
      console.log('✅ Конфигурация Docusaurus обновлена успешно!');
      console.log(`📊 Mermaid контейнеров: ${result.mermaidContainers}`);
      console.log(`📊 SVG элементов: ${result.svgElements}`);
      console.log(`❌ Ошибок: ${result.errors}`);
      console.log(`📸 Скриншот: verification_mermaid_success.png`);
      
      if (result.svgElements > 0) {
        console.log('\n🎉 Mermaid диаграммы успешно работают!');
      } else {
        console.log('\n⚠️  Mermaid диаграммы требуют дополнительной настройки');
      }
    } else {
      console.log('❌ Проверка завершилась с ошибкой:', result.error);
    }
  })
  .catch(error => {
    console.error('Неожиданная ошибка:', error);
  });