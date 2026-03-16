import React, {useMemo} from 'react';
import {useDoc, useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import styles from './styles.module.css';

function collectDocEntries(items, group = null, acc = []) {
  items.forEach((item) => {
    if (!item) {
      return;
    }

    if (item.type === 'doc' && item.id !== 'index') {
      acc.push({
        id: item.id,
        label: item.label,
        groupKey: group?.key ?? item.id,
        groupLabel: group?.label ?? item.label,
        isOverview: false,
      });
      return;
    }

    if (item.type === 'category') {
      const categoryGroup = {
        key: item.link?.type === 'doc' ? item.link.id : group?.key ?? item.label,
        label: item.label,
      };

      if (item.link?.type === 'doc' && item.link.id !== 'index') {
        acc.push({
          id: item.link.id,
          label: item.label,
          groupKey: categoryGroup.key,
          groupLabel: item.label,
          isOverview: true,
        });
      }

      if (item.items?.length) {
        collectDocEntries(item.items, categoryGroup, acc);
      }
    }
  });

  return acc;
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, value));
}

export default function DocProgress() {
  const {metadata} = useDoc();
  const sidebar = useDocsSidebar();

  const allDocs = useMemo(() => {
    if (!sidebar?.items) {
      return [];
    }
    return collectDocEntries(sidebar.items);
  }, [sidebar]);

  const currentDoc = allDocs.find((doc) => doc.id === metadata.id);

  if (!currentDoc || allDocs.length === 0) {
    return null;
  }

  const absoluteIndex = allDocs.findIndex((doc) => doc.id === currentDoc.id);
  const absoluteCurrent = absoluteIndex + 1;
  const absoluteTotal = allDocs.length;
  const absolutePercent = clampPercent((absoluteCurrent / absoluteTotal) * 100);

  const groupDocs = allDocs.filter((doc) => doc.groupKey === currentDoc.groupKey);
  const groupChapterDocs = groupDocs.filter((doc) => !doc.isOverview);
  const moduleCurrent = currentDoc.isOverview
    ? 0
    : groupChapterDocs.findIndex((doc) => doc.id === currentDoc.id) + 1;
  const moduleTotal = groupChapterDocs.length;
  const modulePercent = moduleTotal > 0 ? clampPercent((moduleCurrent / moduleTotal) * 100) : 0;
  const moduleLabel = currentDoc.groupLabel;

  return (
    <section className={styles.progressPanel} aria-label="Прогресс чтения">
      <div className={styles.progressCard}>
        <div className={styles.progressMeta}>
          <span className={styles.progressLabel}>Общий прогресс</span>
          <strong className={styles.progressValue}>
            {absoluteCurrent}/{absoluteTotal}
          </strong>
        </div>
        <div className={styles.progressBar} aria-hidden="true">
          <span className={styles.progressFill} style={{width: `${absolutePercent}%`}} />
        </div>
      </div>
      <div className={styles.progressCard}>
        <div className={styles.progressMeta}>
          <span className={styles.progressLabel}>{moduleLabel}</span>
          <strong className={styles.progressValue}>
            {moduleCurrent}/{moduleTotal}
          </strong>
        </div>
        <div className={styles.progressBar} aria-hidden="true">
          <span className={styles.progressFill} style={{width: `${modulePercent}%`}} />
        </div>
      </div>
    </section>
  );
}
