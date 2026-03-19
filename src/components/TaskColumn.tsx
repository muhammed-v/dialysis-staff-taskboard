import { Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

export const TaskColumn = ({ status, tasks }: TaskColumnProps) => {
  const statusLabels: Record<TaskStatus, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    completed: 'Completed',
  };

  const borderColors: Record<TaskStatus, string> = {
    todo: 'border-l-gray-300',
    in_progress: 'border-l-blue-400',
    completed: 'border-l-green-400',
  };

  return (
    <div className="flex flex-col gap-3 min-w-[280px] flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        <div className={`h-4 w-1 rounded-full border-l-4 ${borderColors[status]}`} />
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
          {statusLabels[status]} <span className="ml-1 text-gray-400 font-medium">({tasks.length})</span>
        </h3>
      </div>
      
      <div className="flex flex-col gap-3 min-h-[120px]">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm italic">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
};
