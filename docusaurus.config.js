import {themes as prismThemes} from 'prism-react-renderer';

const organizationName = 'serjkserj';
const projectName = 'serjkserj.github.io';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'BIM Handbook',
  tagline: 'Практический handbook по BIM-координации, IFC, АГР и экспертизе',
  favicon: 'img/favicon.ico',
  url: `https://${organizationName}.github.io`,
  baseUrl: '/',
  organizationName,
  projectName,
  deploymentBranch: 'main',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  future: {
    v4: true,
  },
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
  },
  markdown: {
    mermaid: true,
  },
  presets: [
    [
      'classic',
      ({
        docs: {
          routeBasePath: 'handbook',
          sidebarPath: './sidebars.js',
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],
  themes: ['@docusaurus/theme-mermaid'],
  scripts: [{src: '/js/diagram-viewer.js', defer: true}],
  themeConfig:
    ({
      image: 'img/handbook-mark.svg',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'BIM Handbook',
        logo: {
          alt: 'BIM Handbook',
          src: 'img/handbook-mark.svg',
        },
        items: [
          {to: '/', label: 'Главная', position: 'left'},
          {
            type: 'docSidebar',
            sidebarId: 'handbookSidebar',
            position: 'left',
            label: 'Учебник',
          },
          {
            to: '/handbook/appendices/APPENDICES_OVERVIEW',
            label: 'Приложения',
            position: 'left',
          },
          {
            href: 'https://github.com/serjkserj/bim-handbook',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Учебник',
            items: [
              {label: 'Открыть handbook', to: '/handbook/'},
              {label: 'Приложения', to: '/handbook/appendices/APPENDICES_OVERVIEW'},
            ],
          },
          {
            title: 'Ключевые темы',
            items: [
              {label: 'IFC', to: '/handbook/module_4_ifc/module_4_overview'},
              {label: 'АГР', to: '/handbook/module_6_agr/module_6_overview'},
              {label: 'Экспертиза', to: '/handbook/module_7_expertise/module_7_overview'},
            ],
          },
          {
            title: 'Репозитории',
            items: [
              {label: 'Исходники handbook', href: 'https://github.com/serjkserj/bim-handbook'},
              {label: 'Pages-сайт', href: 'https://github.com/serjkserj/serjkserj.github.io'},
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} BIM Handbook.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;

