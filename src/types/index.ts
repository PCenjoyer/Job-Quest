export type JobStatus = 'sent' | 'interview' | 'offer' | 'rejected';

export interface Job {
  id: string;
  company: string;
  position: string;
  date: string;
  link: string;
  notes: string;
  status: JobStatus;
  createdAt: number;
}

export type SortField = 'date' | 'createdAt' | 'company';
export type SortOrder = 'asc' | 'desc';

export interface Filter {
  company: string;
  status: JobStatus | 'all';
  sortField: SortField;
  sortOrder: SortOrder;
}

export interface Column {
  id: JobStatus;
  title: string;
  color: string;
}

export const COLUMNS: Column[] = [
  { id: 'sent',      title: 'Отправлено',    color: '#6366f1' },
  { id: 'interview', title: 'Собеседование',  color: '#f59e0b' },
  { id: 'offer',     title: 'Оффер',         color: '#10b981' },
  { id: 'rejected',  title: 'Отказ',         color: '#ef4444' },
];
