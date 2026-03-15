# BIM Handbook Pages Site

Публичный сайт handbook: `https://serjkserj.github.io`.

Репозиторий содержит только актуальный исходный код `Docusaurus`-сайта для публикации handbook и связанных рабочих приложений.

## Что здесь должно жить

- `docs/` — основной контент handbook
- `src/` — компоненты и стили сайта
- `static/` — минимально необходимые публичные ассеты сайта
- `docusaurus.config.js` и `sidebars.js` — конфигурация навигации и сборки
- `.github/workflows/deploy.yml` — актуальный workflow публикации в GitHub Pages

## Что здесь не должно жить

- архивы старых статей и старых docs-наборов
- одноразовые скрипты проверки и временные отладочные файлы
- скриншоты, логи и временные HTML-страницы
- локальные backup-папки и служебные окружения обработки документов
- старые или дублирующие deployment workflow

## Локальная работа

```bash
npm ci
npm run start
```

## Production build

```bash
npm run build
```

## Deployment

Публикация идет через GitHub Actions workflow `deploy.yml` при push в `main`.
