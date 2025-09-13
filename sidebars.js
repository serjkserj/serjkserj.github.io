// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...).

/**
 * Creating a sidebar enables you to:
  - create an ordered group of docs
  - render a sidebar for each doc of that group
  - provide next/previous navigation

  The sidebars can be generated from the filesystem, or explicitly defined here.

  Create as many sidebars as you want.

  @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Начало работы',
      items: [
        'introduction'
      ],
    },
    {
      type: 'category',
      label: 'Инструкции',
      items: [
        'atr_fb_zadanie',
        'ATR_Clashes Manager_Отработка коллизий_Архитекторам',
        'ATR_Navisworks_Работа с коллизиями',
        'ATR_Выгрузка  моделей 12.2 V.2',
        'ATR_Заполнение Код СВОР для архитекторов',
        'ATR_Подрезка коллизий_Revit Helper'
      ],
    },
    {
      type: 'category',
      label: 'База знаний',
      items: [
        {
          type: 'doc',
          id: 'База_знаний_Варианты',
          label: 'База знаний: Варианты платформ'
        },
        {
          type: 'doc',
          id: 'База_знаний_Docusaurus_GitHub_Pages',
          label: 'База знаний: Docusaurus + GitHub Pages'
        },
        {
          type: 'doc',
          id: 'Методология_работы_с_Mermaid_диаграммами',
          label: 'База знаний: Методология работы с Mermaid'
        },
      ],
    },
  ],
};

export default sidebars;
