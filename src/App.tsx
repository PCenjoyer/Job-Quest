import { JobProvider } from './context/JobContext';
import { Header } from './components/Header/Header';
import { Filters } from './components/Filters/Filters';
import { Stats } from './components/Stats/Stats';
import { Board } from './components/Board/Board';
import { JobModal } from './components/JobModal/JobModal';
import styles from './App.module.css';

export function App() {
  return (
    <JobProvider>
      <div className={styles.app}>
        <Header />
        <Stats />
        <Filters />
        <Board />
        <JobModal />
      </div>
    </JobProvider>
  );
}
