import { useState } from 'react';
import { Role } from '../types';
import { useCreateTask } from '../hooks/useTaskMutations';

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
    <form onSubmit={handleSubmit} className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex flex-col gap-4 animate-in">
      <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider">New Task</h3>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-500">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          className="text-sm bg-white border border-gray-200 text-gray-800 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
          autoFocus
          required
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs font-bold text-gray-500">Assign To</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="text-sm bg-white border border-gray-200 text-gray-700 rounded-lg p-2.5 font-medium focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="nurse">Nurse</option>
            <option value="dietician">Dietician</option>
            <option value="social_worker">Social Worker</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs font-bold text-gray-500">Due Date (optional)</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="text-sm bg-white border border-gray-200 text-gray-700 rounded-lg p-2.5 font-medium focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-1">
        <button
          type="submit"
          disabled={createTask.isPending || !title.trim()}
          className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createTask.isPending ? 'Creating...' : 'Create Task'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 bg-white text-gray-600 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>

      {createTask.isError && (
        <p className="text-red-600 text-xs font-medium">Failed to create task: {createTask.error?.message}</p>
      )}
    </form>
  );
};
