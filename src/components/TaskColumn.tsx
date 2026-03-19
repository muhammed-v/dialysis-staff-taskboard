import { Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';
import { Circle, Clock, CheckCircle2, Inbox } from 'lucide-react';

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  patientId: string;
}

const statusConfig: Record<TaskStatus, { label: string; icon: typeof Circle; iconColor: string; bgAccent: string }> = {
  todo: { label: 'To Do', icon: Circle, iconColor: 'text-slate-400', bgAccent: 'bg-slate-50' },
  in_progress: { label: 'In Progress', icon: Clock, iconColor: 'text-amber-500', bgAccent: 'bg-amber-50/50' },
  completed: { label: 'Done', icon: CheckCircle2, iconColor: 'text-emerald-500', bgAccent: 'bg-emerald-50/50' },
};

export const TaskColumn = ({ status, tasks, patientId }: TaskColumnProps) => {
  const config = statusConfig[status] || { label: status, icon: Circle, iconColor: 'text-slate-300', bgAccent: 'bg-slate-50' };
  const Icon = config.icon;
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  return (
    <div className={`flex-1 p-4 min-w-[220px] ${config.bgAccent}`}>
      <div className="flex items-center gap-1.5 mb-3">
        <Icon className={`h-3.5 w-3.5 ${config.iconColor}`} />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          {config.label}
        </span>
        {safeTasks.length > 0 && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
            status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
            status === 'in_progress' ? 'bg-amber-100 text-amber-600' :
            'bg-slate-200 text-slate-500'
          }`}>{safeTasks.length}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {safeTasks.map((task, index) => (
          <TaskCard key={task?.id || `fb-${index}`} task={task} patientId={patientId} />
        ))}

        {safeTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-slate-300">
            <Inbox className="h-5 w-5 mb-1" />
            <p className="text-xs italic">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
};
