import { useState, useEffect, useRef } from 'react';
import { Job, JobStatus, COLUMNS } from '../../types';
import { useJobs } from '../../context/JobContext';
import styles from './JobModal.module.css';

const EMPTY_FORM: Omit<Job, 'id' | 'createdAt'> = {
  company: '',
  position: '',
  date: new Date().toISOString().split('T')[0],
  link: '',
  notes: '',
  status: 'sent',
};

export function JobModal() {
  const { state, dispatch } = useJobs();
  const { isModalOpen, editingJob } = state;
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof EMPTY_FORM, string>>>({});
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isModalOpen) {
      setForm(editingJob ? {
        company: editingJob.company,
        position: editingJob.position,
        date: editingJob.date,
        link: editingJob.link,
        notes: editingJob.notes,
        status: editingJob.status,
      } : { ...EMPTY_FORM, date: new Date().toISOString().split('T')[0] });
      setErrors({});
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [isModalOpen, editingJob]);

  if (!isModalOpen) return null;

  const set = (field: keyof typeof EMPTY_FORM, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.company.trim()) next.company = 'Обязательное поле';
    if (!form.position.trim()) next.position = 'Обязательное поле';
    if (!form.date) next.date = 'Обязательное поле';
    if (form.link && !isValidUrl(form.link)) next.link = 'Некорректный URL';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (editingJob) {
      dispatch({ type: 'UPDATE_JOB', payload: { ...editingJob, ...form } });
    } else {
      dispatch({ type: 'ADD_JOB', payload: form });
    }
  };

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) dispatch({ type: 'CLOSE_MODAL' });
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') dispatch({ type: 'CLOSE_MODAL' });
  };

  return (
    <div className={styles.overlay} onClick={handleBackdrop} onKeyDown={handleKey}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label={editingJob ? 'Редактировать вакансию' : 'Добавить вакансию'}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {editingJob ? 'Редактировать вакансию' : 'Новая вакансия'}
          </h2>
          <button className={styles.closeBtn} onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <Field label="Компания *" error={errors.company}>
              <input
                ref={firstInputRef}
                className={fieldClass(errors.company)}
                placeholder="Например: Яндекс"
                value={form.company}
                onChange={e => set('company', e.target.value)}
              />
            </Field>
            <Field label="Должность *" error={errors.position}>
              <input
                className={fieldClass(errors.position)}
                placeholder="Frontend Developer"
                value={form.position}
                onChange={e => set('position', e.target.value)}
              />
            </Field>
          </div>

          <div className={styles.row}>
            <Field label="Дата отклика *" error={errors.date}>
              <input
                type="date"
                className={fieldClass(errors.date)}
                value={form.date}
                onChange={e => set('date', e.target.value)}
              />
            </Field>
            <Field label="Статус">
              <select
                className={styles.select}
                value={form.status}
                onChange={e => set('status', e.target.value as JobStatus)}
              >
                {COLUMNS.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Ссылка на вакансию" error={errors.link}>
            <input
              className={fieldClass(errors.link)}
              placeholder="https://hh.ru/vacancy/..."
              value={form.link}
              onChange={e => set('link', e.target.value)}
            />
          </Field>

          <Field label="Заметки">
            <textarea
              className={styles.textarea}
              placeholder="HR написал, что рассмотрят за 3 дня..."
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              rows={3}
            />
          </Field>

          <div className={styles.formFooter}>
            <button type="button" className={styles.cancelBtn} onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>
              Отмена
            </button>
            <button type="submit" className={styles.submitBtn}>
              {editingJob ? 'Сохранить изменения' : 'Добавить вакансию'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      {children}
      {error && <span className={styles.error}>{error}</span>}
    </label>
  );
}

function fieldClass(error?: string): string {
  return `${styles.input} ${error ? styles.inputError : ''}`;
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
