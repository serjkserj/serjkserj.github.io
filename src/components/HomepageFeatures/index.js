import Heading from '@theme/Heading';
import styles from './styles.module.css';

const features = [
  {
    title: 'Профессия без тумана',
    text:
      'Учебник шаг за шагом собирает профессию BIM-координатора АР: от среды проекта и ролей до проверки модели и ведения замечаний.',
  },
  {
    title: 'IFC, АГР и экспертиза разведены по смыслу',
    text:
      'Сложные внешние процессы объяснены без путаницы между требованиями обмена, городской проверки и экспертизы.',
  },
  {
    title: 'Модель как источник данных',
    text:
      'Центральная идея handbook — смотреть на модель как на систему геометрии, атрибутов, зон, площадей, ТЭП и рисков.',
  },
  {
    title: 'Диаграммы и рабочие маршруты',
    text:
      'Внутри глав есть Mermaid-схемы, а в приложениях — маршруты проверки, чек-листы и шаблоны для реальной практики.',
  },
  {
    title: 'Подходит для веб-публикации',
    text:
      'Контент уже организован как большой docs-раздел: его удобно читать по порядку, искать по модулям и ссылаться на конкретные главы.',
  },
  {
    title: 'Основан на локальных источниках проекта',
    text:
      'Структура handbook и акценты выстроены на базе локальных методических и аналитических материалов, а спорные места помечены отдельно.',
  },
];

export default function HomepageFeatures() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.heading}>
          <p className={styles.kicker}>Что делает сайт полезным</p>
          <Heading as="h2">Не просто набор глав, а рабочая система обучения</Heading>
        </div>
        <div className={styles.grid}>
          {features.map((feature) => (
            <article key={feature.title} className={styles.card}>
              <Heading as="h3">{feature.title}</Heading>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
