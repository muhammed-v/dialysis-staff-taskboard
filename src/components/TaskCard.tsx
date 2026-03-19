import { Task } from '../types';

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  // Graceful fallback for completely null rendering
  if (!task) return null;

  // Graceful data fallbacks to guarantee no UI crashes on strictly typed missing data
  const title = task.title || 'Untitled Task';
  const roleDisplay = task.role ? task.role.replace('_', ' ') : 'Unassigned';
  const isValidDate = task.dueDate && !isNaN(new Date(task.dueDate).getTime());

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
      <h4 className="font-semibold text-gray-800 text-sm leading-snug">{title}</h4>
      
      <div className="flex justify-between items-center text-xs mt-1">
        <span className="capitalize bg-blue-50 text-blue-700 font-medium px-2.5 py-1 rounded-md">
          {roleDisplay}
        </span>
        
        {isValidDate && (
          <span className="text-gray-500 font-medium whitespace-nowrap">
            {new Date(task.dueDate!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  );
};
