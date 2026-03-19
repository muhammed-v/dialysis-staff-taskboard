import { Task } from '../types';

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
      <h4 className="font-semibold text-gray-800 text-sm leading-snug">{task.title}</h4>
      
      <div className="flex justify-between items-center text-xs mt-1">
        <span className="capitalize bg-blue-50 text-blue-700 font-medium px-2.5 py-1 rounded-md">
          {task.role.replace('_', ' ')}
        </span>
        
        {task.dueDate && (
          <span className="text-gray-500 font-medium whitespace-nowrap">
            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  );
};
