import { Job, JobStatus, COLUMNS } from '../../types';
import { useJobs } from '../../context/JobContext';
import styles from './JobCard.module.css';

interface Props {
  job: Job;
}

export function JobCard({ job }: Props) {
  const { dispatch } = useJobs();

  const col = COLUMNS.find(c => c.id === job.status)!;
  const otherStatuses = COLUMNS.filter(c => c.id !== job.status);

  const formattedDate = new Date(job.date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article className={styles.card}>
      <div className={styles.colorBar} style={{ background: col.color }} />

      <div className={styles.body}>
        <div className={styles.top}>
          <div className={styles.info}>
            <h3 className={styles.position}>{job.position}</h3>
            <p className={styles.company}>{job.company}</p>
          </div>
          <div className={styles.menu}>
            <button
              className={styles.menuBtn}
              title="Редактировать"
              onClick={() => dispatch({ type: 'OPEN_MODAL', payload: job })}
            >
              ✏️
            </button>
            <button
              className={`${styles.menuBtn} ${styles.deleteBtn}`}
              title="Удалить"
              onClick={() => {
                if (confirm(`Удалить вакансию "${job.position}" в ${job.company}?`)) {
                  dispatch({ type: 'DELETE_JOB', payload: job.id });
                }
              }}
            >
              🗑️
            </button>
          </div>
        </div>

        <div className={styles.meta}>
          <span className={styles.date}>📅 {formattedDate}</span>
          {job.link && (
            <a
              href={job.link}
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 Открыть
            </a>
          )}
        </div>

        {job.notes && (
          <p className={styles.notes}>{job.notes}</p>
        )}

        {otherStatuses.length > 0 && (
          <div className={styles.moveActions}>
            {otherStatuses.map(s => (
              <MoveButton
                key={s.id}
                targetStatus={s.id}
                label={s.title}
                color={s.color}
                onClick={() => dispatch({ type: 'MOVE_JOB', payload: { id: job.id, status: s.id } })}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

interface MoveButtonProps {
  targetStatus: JobStatus;
  label: string;
  color: string;
  onClick: () => void;
}

function MoveButton({ label, color, onClick }: MoveButtonProps) {
  return (
    <button
      className={styles.moveBtn}
      style={{ '--move-color': color } as React.CSSProperties}
      onClick={onClick}
      title={`Переместить в "${label}"`}
    >
      → {label}
    </button>
  );
}
