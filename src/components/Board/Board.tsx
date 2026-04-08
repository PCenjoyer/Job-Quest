import { COLUMNS } from '../../types';
import { Column } from '../Column/Column';
import styles from './Board.module.css';

export function Board() {
  return (
    <main className={styles.board}>
      {COLUMNS.map(col => (
        <Column key={col.id} column={col} />
      ))}
    </main>
  );
}
