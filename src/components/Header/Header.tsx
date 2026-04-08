import { useJobs } from '../../context/JobContext';
import { DEMO_JOBS } from '../../data/demoJobs';
import styles from './Header.module.css';

const DEMO_IDS = new Set(DEMO_JOBS.map(j => j.id));

export function Header() {
  const { state, dispatch } = useJobs();
  const total = state.jobs.length;
  const isDemo = total > 0 && state.jobs.every(j => DEMO_IDS.has(j.id));

  const clearDemo = () => {
    if (confirm('Удалить все демо-данные и начать с чистого листа?')) {
      state.jobs
        .filter(j => DEMO_IDS.has(j.id))
        .forEach(j => dispatch({ type: 'DELETE_JOB', payload: j.id }));
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.logo}>🎯</span>
        <div>
          <h1 className={styles.title}>JobQuest</h1>
          <p className={styles.subtitle}>Трекер поиска работы</p>
        </div>
      </div>
      <div className={styles.actions}>
        {isDemo && (
          <span className={styles.demoBadge} title="Это демо-данные">
            Демо
          </span>
        )}
        {total > 0 && (
          <span className={styles.counter}>
            {total} {pluralize(total, 'вакансия', 'вакансии', 'вакансий')}
          </span>
        )}
        {isDemo && (
          <button className={styles.clearDemoBtn} onClick={clearDemo}>
            Очистить демо
          </button>
        )}
        <button
          className={styles.addButton}
          onClick={() => dispatch({ type: 'OPEN_MODAL' })}
        >
          + Добавить вакансию
        </button>
      </div>
    </header>
  );
}

function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}
