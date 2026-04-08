import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Job, JobStatus, Filter } from '../types';
import { AppState, AppAction, jobReducer, initialState } from '../reducer/jobReducer';
import { DEMO_JOBS } from '../data/demoJobs';

interface JobContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  filteredJobs: (status: JobStatus) => Job[];
}

const JobContext = createContext<JobContextValue | null>(null);

const STORAGE_KEY = 'jobquest_jobs';

export function JobProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(jobReducer, initialState, (init) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const jobs = JSON.parse(stored) as Job[];
        // First-run: if storage exists but is empty array, load demo data
        return { ...init, jobs: jobs.length > 0 ? jobs : DEMO_JOBS };
      }
    } catch {
      // ignore
    }
    // No storage at all — first launch, show demo data
    return { ...init, jobs: DEMO_JOBS };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.jobs));
  }, [state.jobs]);

  const filteredJobs = (status: JobStatus): Job[] => {
    const { company, status: filterStatus, sortField, sortOrder } = state.filter;

    const filtered = state.jobs.filter(job => {
      if (job.status !== status) return false;
      if (company) {
        const q = company.toLowerCase();
        if (!job.company.toLowerCase().includes(q) && !job.position.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (filterStatus !== 'all' && job.status !== filterStatus) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'company') {
        cmp = a.company.localeCompare(b.company, 'ru');
      } else if (sortField === 'date') {
        cmp = a.date.localeCompare(b.date);
      } else {
        cmp = a.createdAt - b.createdAt;
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  };

  return (
    <JobContext.Provider value={{ state, dispatch, filteredJobs }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobs(): JobContextValue {
  const ctx = useContext(JobContext);
  if (!ctx) throw new Error('useJobs must be used within JobProvider');
  return ctx;
}

export type { Filter };
