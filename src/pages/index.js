import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import styles from './index.module.css';

const learningPath = [
  'Понять среду проектирования и роль BIM-координатора.',
  'Разобраться в связке Revit -> IFC -> проверка -> выдача.',
  'Научиться отличать АГР от экспертизы и не смешивать их требования.',
  'Увидеть, как зоны, площади, параметры и ТЭП собираются в систему.',
];

const quickLinks = [
  {
    title: 'Начать с нуля',
    description: 'Вступление и базовый модуль для человека без системного опыта.',
    to: '/handbook/intro/vvedenie',
  },
  {
    title: 'Сразу к IFC',
    description: 'Ключевой техслой обмена, проверок и автоматизации.',
    to: '/handbook/module_4_ifc/module_4_overview',
  },
  {
    title: 'К АГР и экспертизе',
    description: 'Два внешних контура, которые нельзя путать между собой.',
    to: '/handbook/module_6_agr/module_6_overview',
  },
  {
    title: 'К приложениям',
    description: 'Чек-листы, словарь и таблицы для повседневной работы.',
    to: '/handbook/appendices/APPENDICES_OVERVIEW',
  },
];

function HeroPanel() {
  return (
    <header className={clsx(styles.hero)}>
      <div className="container">
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Практический BIM handbook</p>
            <Heading as="h1" className={styles.heroTitle}>
              BIM-координатор АР с нуля
            </Heading>
            <p className={styles.heroLead}>
              Сайт-учебник, который последовательно переводит новичка от проектной
              среды и BIM-логики к IFC, АГР, экспертизе, ТЭП, проверкам и реальной
              работе координатора на проекте.
            </p>
            <div className={styles.heroActions}>
              <Link className="button button--primary button--lg" to="/handbook">
                Открыть handbook
              </Link>
              <Link className={styles.secondaryAction} to="/handbook/appendices/APPENDICES_OVERVIEW">
                Перейти к рабочим приложениям
              </Link>
            </div>
          </div>
          <div className={styles.heroCard}>
            <p className={styles.cardLabel}>Маршрут обучения</p>
            <ul className={styles.pathList}>
              {learningPath.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className={styles.metricRow}>
              <div>
                <strong>14</strong>
                <span>модулей</span>
              </div>
              <div>
                <strong>18+</strong>
                <span>приложений</span>
              </div>
              <div>
                <strong>Mermaid</strong>
                <span>схемы и маршруты</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function QuickStart() {
  return (
    <section className={styles.quickStart}>
      <div className="container">
        <div className={styles.sectionHeading}>
          <p className={styles.sectionKicker}>Быстрый вход</p>
          <Heading as="h2">Сайт собран вокруг реальных сценариев</Heading>
          <p>
            Здесь не нужно сначала читать все подряд. Можно идти по полному маршруту
            или быстро открывать тот контур, который нужен прямо на проекте.
          </p>
        </div>
        <div className={styles.quickGrid}>
          {quickLinks.map((link) => (
            <Link key={link.title} className={styles.quickCard} to={link.to}>
              <span className={styles.quickTitle}>{link.title}</span>
              <span className={styles.quickDescription}>{link.description}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      title="BIM Handbook"
      description="Практический учебник по BIM-координации, IFC, АГР и экспертизе">
      <HeroPanel />
      <main>
        <QuickStart />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
