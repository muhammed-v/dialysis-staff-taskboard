import { useState } from 'react';
import { Patient, TaskStatus } from '../types';
import { TaskColumn } from './TaskColumn';
import { CreateTaskForm } from './CreateTaskForm';
import { useTasks } from '../hooks/useTasks';
import { FilterOptions, filterTasks } from '../utils/filterTasks';
import { Plus, X, Loader2, RefreshCw } from 'lucide-react';

interface PatientRowProps {
  patient: Patient;
  filterOptions: FilterOptions;
}

const avatarColors = [
  'bg-emerald-500',
  'bg-cyan-500',
  'bg-teal-500',
  'bg-amber-500',
  'bg-lime-600',
];

export const PatientRow = ({ patient, filterOptions }: PatientRowProps) => {
  const statuses: TaskStatus[] = ['todo', 'in_progress', 'completed'];
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: rawTasks, isLoading, error, refetch } = useTasks(patient?.id);
  const tasks = rawTasks ? filterTasks(rawTasks, filterOptions) : [];

  const colorIndex = (patient?.id?.charCodeAt(1) || 0) % avatarColors.length;
  const avatarGradient = avatarColors[colorIndex];

  return (
    <div className="bg-white/80 backdrop-blur border border-white/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Patient Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100/80">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-full ${avatarGradient} flex items-center justify-center text-sm font-bold text-white shadow-sm flex-shrink-0`}>
            {patient?.name?.charAt(0) || '?'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-800 leading-tight">{patient?.name || 'Unknown'}</h2>
              {tasks.length > 0 && (
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">{tasks.length}</span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {patient?.age ? `${patient.age} yrs` : 'Age unknown'} · <span className="text-slate-300">{patient?.id}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
            showCreateForm
              ? 'text-red-500 bg-red-50 hover:bg-red-100'
              : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
          }`}
        >
          {showCreateForm ? <><X className="h-3.5 w-3.5" /> Cancel</> : <><Plus className="h-3.5 w-3.5" /> Add task</>}
        </button>
      </div>

      {/* Create Task Form */}
      {showCreateForm && (
        <div className="border-b border-slate-100 px-5 py-4 bg-emerald-50/30">
          <CreateTaskForm patientId={patient?.id} onClose={() => setShowCreateForm(false)} />
        </div>
      )}

      {/* Task Columns */}
      <div className="flex gap-0 divide-x divide-slate-100/80 relative min-h-[140px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 text-emerald-500 animate-spin" />
              <span className="text-xs text-slate-400 font-medium">Loading tasks…</span>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-10 gap-2">
            <p className="text-sm text-red-500 font-semibold">Could not load tasks</p>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 font-medium transition"
            >
              <RefreshCw className="h-3 w-3" /> Retry
            </button>
          </div>
        )}

        {statuses.map(status => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks?.filter(t => t?.status === status) || []}
            patientId={patient?.id}
          />
        ))}
      </div>
    </div>
  );
};
