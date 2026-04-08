import { Column as ColumnType, JobStatus } from '../../types';
import { useJobs } from '../../context/JobContext';
import { JobCard } from '../JobCard/JobCard';
import styles from './Column.module.css';

interface Props {
  column: ColumnType;
}

export function Column({ column }: Props) {
  const { filteredJobs, dispatch } = useJobs();
  const jobs = filteredJobs(column.id as JobStatus);

  return (
    <section className={styles.column}>
      <div className={styles.header} style={{ '--col-color': column.color } as React.CSSProperties}>
        <div className={styles.titleRow}>
          <span className={styles.indicator} />
          <h2 className={styles.title}>{column.title}</h2>
          <span className={styles.count}>{jobs.length}</span>
        </div>
      </div>

      <div className={styles.cards}>
        {jobs.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>{getEmptyIcon(column.id as JobStatus)}</span>
            <p className={styles.emptyText}>Нет вакансий</p>
            {column.id === 'sent' && (
              <button
                className={styles.emptyAdd}
                onClick={() => dispatch({ type: 'OPEN_MODAL' })}
              >
                Добавить первую
              </button>
            )}
          </div>
        ) : (
          jobs.map(job => <JobCard key={job.id} job={job} />)
        )}
      </div>
    </section>
  );
}

function getEmptyIcon(status: JobStatus): string {
  const icons: Record<JobStatus, string> = {
    sent: '📤',
    interview: '💬',
    offer: '🎉',
    rejected: '👋',
  };
  return icons[status];
}
