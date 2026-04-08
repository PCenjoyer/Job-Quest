import { useJobs } from '../../context/JobContext';
import { COLUMNS, JobStatus } from '../../types';
import styles from './Stats.module.css';

export function Stats() {
  const { state } = useJobs();
  const { jobs } = state;

  if (jobs.length === 0) return null;

  const counts: Record<JobStatus, number> = {
    sent: 0, interview: 0, offer: 0, rejected: 0,
  };
  for (const job of jobs) counts[job.status]++;

  const total = jobs.length;
  const interviewRate = total > 0 ? Math.round((counts.interview + counts.offer) / total * 100) : 0;
  const offerRate = total > 0 ? Math.round(counts.offer / total * 100) : 0;

  return (
    <div className={styles.stats}>
      {COLUMNS.map(col => {
        const count = counts[col.id];
        const pct = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={col.id} className={styles.stat}>
            <div className={styles.statHeader}>
              <span className={styles.dot} style={{ background: col.color }} />
              <span className={styles.statLabel}>{col.title}</span>
              <span className={styles.statCount}>{count}</span>
            </div>
            <div className={styles.bar}>
              <div
                className={styles.barFill}
                style={{ width: `${pct}%`, background: col.color }}
              />
            </div>
          </div>
        );
      })}

      <div className={styles.divider} />

      <div className={styles.rates}>
        <div className={styles.rate}>
          <span className={styles.rateValue} style={{ color: '#f59e0b' }}>{interviewRate}%</span>
          <span className={styles.rateLabel}>до собеседования</span>
        </div>
        <div className={styles.rate}>
          <span className={styles.rateValue} style={{ color: '#10b981' }}>{offerRate}%</span>
          <span className={styles.rateLabel}>конверсия в оффер</span>
        </div>
      </div>
    </div>
  );
}
