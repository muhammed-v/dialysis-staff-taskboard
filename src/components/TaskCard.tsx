import { useState } from 'react';
import { Task, Role, TaskStatus } from '../types';
import { useUpdateTask } from '../hooks/useTaskMutations';
import { Pencil, X, Stethoscope, Salad, HeartHandshake, CalendarDays } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  patientId: string;
}

const roleConfig: Record<string, { icon: typeof Stethoscope; bg: string; text: string; label: string }> = {
  nurse: { icon: Stethoscope, bg: 'bg-sky-100', text: 'text-sky-700', label: 'Nurse' },
  dietician: { icon: Salad, bg: 'bg-teal-100', text: 'text-teal-700', label: 'Dietician' },
  social_worker: { icon: HeartHandshake, bg: 'bg-orange-100', text: 'text-orange-700', label: 'Social Worker' },
};

export const TaskCard = ({ task, patientId }: TaskCardProps) => {
  const updateTask = useUpdateTask();
  const [isEditing, setIsEditing] = useState(false);

  if (!task) return null;

  const title = task.title || 'Untitled Task';
  const role = roleConfig[task.role] || { icon: Stethoscope, bg: 'bg-slate-100', text: 'text-slate-600', label: 'Unassigned' };
  const RoleIcon = role.icon;
  const isValidDate = task.dueDate && !isNaN(new Date(task.dueDate).getTime());

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTask.mutate({ taskId: task.id, patientId, updates: { status: newStatus } });
  };

  const handleRoleChange = (newRole: Role) => {
    updateTask.mutate({ taskId: task.id, patientId, updates: { role: newRole } });
  };

  const handleDueDateChange = (newDate: string) => {
    const dueDate = newDate ? new Date(newDate).toISOString() : undefined;
    updateTask.mutate({ taskId: task.id, patientId, updates: { dueDate } });
  };

  const formattedDate = isValidDate
    ? new Date(task.dueDate!).toISOString().split('T')[0]
    : '';

  return (
    <div className={`border border-slate-100 rounded-lg p-3 bg-white hover:border-emerald-200 hover:shadow-sm transition-all group ${updateTask.isPending ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-slate-800 font-medium leading-snug">{title}</p>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex-shrink-0 h-6 w-6 rounded-md flex items-center justify-center transition ${
            isEditing
              ? 'bg-red-50 text-red-400 hover:bg-red-100'
              : 'text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 opacity-0 group-hover:opacity-100'
          }`}
          title={isEditing ? 'Close' : 'Edit task'}
        >
          {isEditing ? <X className="h-3.5 w-3.5" /> : <Pencil className="h-3 w-3" />}
        </button>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-2 mt-2">
        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${role.bg} ${role.text}`}>
          <RoleIcon className="h-3 w-3" />
          {role.label}
        </span>
        {isValidDate && (
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
            <CalendarDays className="h-3 w-3" />
            {new Date(task.dueDate!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      {/* Edit controls */}
      {isEditing && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
          <select
            value={task.status || 'todo'}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-600 rounded-md px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Done</option>
          </select>

          <select
            value={task.role || 'nurse'}
            onChange={(e) => handleRoleChange(e.target.value as Role)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-600 rounded-md px-2 py-1.5 w-full capitalize focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400"
          >
            <option value="nurse">Nurse</option>
            <option value="dietician">Dietician</option>
            <option value="social_worker">Social Worker</option>
          </select>

          <input
            type="date"
            value={formattedDate}
            onChange={(e) => handleDueDateChange(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-600 rounded-md px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400"
          />
        </div>
      )}
    </div>
  );
};
