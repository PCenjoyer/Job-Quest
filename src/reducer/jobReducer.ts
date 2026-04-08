import { Job, JobStatus, Filter, SortField, SortOrder } from '../types';

export type { SortField, SortOrder };

export interface AppState {
  jobs: Job[];
  filter: Filter;
  editingJob: Job | null;
  isModalOpen: boolean;
}

export type AppAction =
  | { type: 'ADD_JOB'; payload: Omit<Job, 'id' | 'createdAt'> }
  | { type: 'UPDATE_JOB'; payload: Job }
  | { type: 'DELETE_JOB'; payload: string }
  | { type: 'MOVE_JOB'; payload: { id: string; status: JobStatus } }
  | { type: 'SET_FILTER'; payload: Partial<Filter> }
  | { type: 'OPEN_MODAL'; payload?: Job }
  | { type: 'CLOSE_MODAL' };

export const initialState: AppState = {
  jobs: [],
  filter: { company: '', status: 'all', sortField: 'createdAt', sortOrder: 'desc' },
  editingJob: null,
  isModalOpen: false,
};

export function jobReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_JOB': {
      const newJob: Job = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      return { ...state, jobs: [newJob, ...state.jobs], isModalOpen: false };
    }

    case 'UPDATE_JOB': {
      return {
        ...state,
        jobs: state.jobs.map(j => (j.id === action.payload.id ? action.payload : j)),
        isModalOpen: false,
        editingJob: null,
      };
    }

    case 'DELETE_JOB': {
      return { ...state, jobs: state.jobs.filter(j => j.id !== action.payload) };
    }

    case 'MOVE_JOB': {
      return {
        ...state,
        jobs: state.jobs.map(j =>
          j.id === action.payload.id ? { ...j, status: action.payload.status } : j,
        ),
      };
    }

    case 'SET_FILTER': {
      return { ...state, filter: { ...state.filter, ...action.payload } };
    }

    case 'OPEN_MODAL': {
      return { ...state, isModalOpen: true, editingJob: action.payload ?? null };
    }

    case 'CLOSE_MODAL': {
      return { ...state, isModalOpen: false, editingJob: null };
    }

    default:
      return state;
  }
}
