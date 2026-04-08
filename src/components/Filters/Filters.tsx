import { useJobs } from '../../context/JobContext';
import { JobStatus, SortField, Filter, COLUMNS } from '../../types';
import styles from './Filters.module.css';

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'createdAt', label: 'По добавлению' },
  { value: 'date',      label: 'По дате отклика' },
  { value: 'company',   label: 'По компании' },
];

export function Filters() {
  const { state, dispatch } = useJobs();
  const { filter } = state;

  const set = (payload: Partial<Filter>) =>
    dispatch({ type: 'SET_FILTER', payload });

  const hasActiveFilter =
    filter.company !== '' ||
    filter.status !== 'all' ||
    filter.sortField !== 'createdAt' ||
    filter.sortOrder !== 'desc';

  return (
    <div className={styles.filters}>
      {/* Search */}
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          className={styles.search}
          placeholder="Поиск по компании или должности..."
          value={filter.company}
          onChange={e => set({ company: e.target.value })}
        />
        {filter.company && (
          <button className={styles.clearSearch} onClick={() => set({ company: '' })}>×</button>
        )}
      </div>

      {/* Status tabs */}
      <div className={styles.statusTabs}>
        <button
          className={`${styles.tab} ${filter.status === 'all' ? styles.tabActive : ''}`}
          onClick={() => set({ status: 'all' })}
        >
          Все
        </button>
        {COLUMNS.map(col => (
          <button
            key={col.id}
            className={`${styles.tab} ${filter.status === col.id ? styles.tabActive : ''}`}
            style={filter.status === col.id ? { '--tab-color': col.color } as React.CSSProperties : undefined}
            onClick={() => set({ status: col.id as JobStatus })}
          >
            {col.title}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className={styles.sortGroup}>
        <select
          className={styles.sortSelect}
          value={filter.sortField}
          onChange={e => set({ sortField: e.target.value as SortField })}
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <button
          className={styles.sortOrder}
          title={filter.sortOrder === 'desc' ? 'По убыванию' : 'По возрастанию'}
          onClick={() => set({ sortOrder: filter.sortOrder === 'desc' ? 'asc' : 'desc' })}
        >
          {filter.sortOrder === 'desc' ? '↓' : '↑'}
        </button>
      </div>

      {hasActiveFilter && (
        <button
          className={styles.resetAll}
          onClick={() => set({ company: '', status: 'all', sortField: 'createdAt', sortOrder: 'desc' })}
        >
          Сбросить
        </button>
      )}
    </div>
  );
}
