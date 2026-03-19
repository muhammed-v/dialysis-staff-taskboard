import { useState } from 'react';
import { Role } from '../types';
import { useCreateTask } from '../hooks/useTaskMutations';
import { Loader2, Plus } from 'lucide-react';

interface CreateTaskFormProps {
  patientId: string;
  onClose: () => void;
}

export const CreateTaskForm = ({ patientId, onClose }: CreateTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [role, setRole] = useState<Role>('nurse');
  const [dueDate, setDueDate] = useState('');

  const createTask = useCreateTask();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createTask.mutate(
      {
        patientId,
        input: {
          patientId,
          title: title.trim(),
          role,
          status: 'todo',
          ...(dueDate ? { dueDate: new Date(dueDate).toISOString() } : {}),
        },
      },
      {
        onSuccess: () => {
          setTitle('');
          setRole('nurse');
          setDueDate('');
          onClose();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-end gap-3">
      <div className="flex-1 w-full">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title…"
          className="w-full text-sm bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400"
          autoFocus
          required
        />
      </div>

      <select
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
        className="text-sm bg-white border border-slate-200 text-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400"
      >
        <option value="nurse">Nurse</option>
        <option value="dietician">Dietician</option>
        <option value="social_worker">Social Worker</option>
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="text-sm bg-white border border-slate-200 text-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400"
      />

      <button
        type="submit"
        disabled={createTask.isPending || !title.trim()}
        className="flex items-center gap-1.5 text-sm font-semibold bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition shadow-sm shadow-emerald-200 disabled:opacity-40 disabled:cursor-default whitespace-nowrap"
      >
        {createTask.isPending ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Adding…</> : <><Plus className="h-3.5 w-3.5" /> Add</>}
      </button>

      {createTask.isError && (
        <p className="text-red-500 text-xs">{createTask.error?.message}</p>
      )}
    </form>
  );
};
