// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.join(__dirname, 'docs');

function stripNumericPrefix(value) {
  return value.replace(/^\d+_/, '').replace(/\.(md|mdx)$/i, '');
}

function getDocId(dirName, fileName) {
  return `${stripNumericPrefix(dirName)}/${stripNumericPrefix(fileName)}`;
}

function getDocTitle(dirName, fileName) {
  const filePath = path.join(docsDir, dirName, fileName);
  const content = fs.readFileSync(filePath, 'utf8');
  const headingMatch = content.match(/^#\s+(.+)$/m);
  return headingMatch ? headingMatch[1].trim() : stripNumericPrefix(fileName).replace(/_/g, ' ');
}

function listMarkdownFiles(dirName) {
  return fs
    .readdirSync(path.join(docsDir, dirName), {withFileTypes: true})
    .filter((entry) => entry.isFile() && /\.(md|mdx)$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, 'ru', {numeric: true, sensitivity: 'base'}));
}

function buildDocItems({dirName, exclude = [], numberingPrefix, simpleNumeric = false}) {
  const files = listMarkdownFiles(dirName).filter((fileName) => !exclude.includes(fileName));

  return files.map((fileName, index) => {
    const title = getDocTitle(dirName, fileName);
    const label = simpleNumeric
      ? `${index + 1}. ${title}`
      : numberingPrefix
        ? `${numberingPrefix}.${index + 1} ${title}`
        : title;

    return {
      type: 'doc',
      id: getDocId(dirName, fileName),
      label,
    };
  });
}

function buildModuleCategory({label, dirName, overviewFile, numberingPrefix}) {
  return {
    type: 'category',
    label,
    link: {
      type: 'doc',
      id: getDocId(dirName, overviewFile),
    },
    items: buildDocItems({
      dirName,
      exclude: [overviewFile],
      numberingPrefix,
    }),
  };
}

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  handbookSidebar: [
    'index',
    {
      type: 'category',
      label: 'Вступление',
      link: {
        type: 'doc',
        id: getDocId('01_intro', '00_vvedenie.md'),
      },
      items: buildDocItems({
        dirName: '01_intro',
        exclude: ['00_vvedenie.md'],
        simpleNumeric: true,
      }),
    },
    buildModuleCategory({
      label: 'Модуль 0. Базовая карта проекта',
      dirName: '02_module_0_basics',
      overviewFile: '00_module_0_overview.md',
      numberingPrefix: '0',
    }),
    buildModuleCategory({
      label: 'Модуль 1. BIM',
      dirName: '03_module_1_bim',
      overviewFile: '00_module_1_overview.md',
      numberingPrefix: '1',
    }),
    buildModuleCategory({
      label: 'Модуль 2. BIM-координатор',
      dirName: '04_module_2_bim_coordinator',
      overviewFile: '00_module_2_overview.md',
      numberingPrefix: '2',
    }),
    buildModuleCategory({
      label: 'Модуль 3. Revit-модель',
      dirName: '05_module_3_revit',
      overviewFile: '00_module_3_overview.md',
      numberingPrefix: '3',
    }),
    buildModuleCategory({
      label: 'Модуль 4. IFC',
      dirName: '06_module_4_ifc',
      overviewFile: '00_module_4_overview.md',
      numberingPrefix: '4',
    }),
    buildModuleCategory({
      label: 'Модуль 5. Документы и требования',
      dirName: '07_module_5_requirements',
      overviewFile: '00_module_5_overview.md',
      numberingPrefix: '5',
    }),
    buildModuleCategory({
      label: 'Модуль 6. АГР',
      dirName: '08_module_6_agr',
      overviewFile: '00_module_6_overview.md',
      numberingPrefix: '6',
    }),
    buildModuleCategory({
      label: 'Модуль 7. Экспертиза',
      dirName: '09_module_7_expertise',
      overviewFile: '00_module_7_overview.md',
      numberingPrefix: '7',
    }),
    buildModuleCategory({
      label: 'Модуль 8. Зоны, площади и ТЭП',
      dirName: '10_module_8_areas_teps',
      overviewFile: '00_module_8_overview.md',
      numberingPrefix: '8',
    }),
    buildModuleCategory({
      label: 'Модуль 9. Параметры и классификация',
      dirName: '11_module_9_parameters',
      overviewFile: '00_module_9_overview.md',
      numberingPrefix: '9',
    }),
    buildModuleCategory({
      label: 'Модуль 10. QC',
      dirName: '12_module_10_qc',
      overviewFile: '00_module_10_overview.md',
      numberingPrefix: '10',
    }),
    buildModuleCategory({
      label: 'Модуль 11. Работа на проекте',
      dirName: '13_module_11_project_work',
      overviewFile: '00_module_11_overview.md',
      numberingPrefix: '11',
    }),
    buildModuleCategory({
      label: 'Модуль 12. Ошибки и кейсы',
      dirName: '14_module_12_cases',
      overviewFile: '00_module_12_overview.md',
      numberingPrefix: '12',
    }),
    buildModuleCategory({
      label: 'Модуль 13. Рост координатора',
      dirName: '15_module_13_growth',
      overviewFile: '00_module_13_overview.md',
      numberingPrefix: '13',
    }),
    {
      type: 'doc',
      id: getDocId('16_conclusion', '00_zaklyuchenie.md'),
      label: 'Заключение',
    },
    {
      type: 'category',
      label: 'Приложения',
      link: {
        type: 'doc',
        id: getDocId('90_appendices', '00_APPENDICES_OVERVIEW.md'),
      },
      items: buildDocItems({
        dirName: '90_appendices',
        exclude: ['00_APPENDICES_OVERVIEW.md'],
      }),
    },
  ],
};

export default sidebars;
