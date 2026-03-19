import { Task, Role, TaskStatus } from '../types';
import { useUpdateTask } from '../hooks/useTaskMutations';

interface TaskCardProps {
  task: Task;
  patientId: string;
}

export const TaskCard = ({ task, patientId }: TaskCardProps) => {
  const updateTask = useUpdateTask();

  if (!task) return null;

  const title = task.title || 'Untitled Task';
  const isValidDate = task.dueDate && !isNaN(new Date(task.dueDate).getTime());

  // Format the ISO date string into YYYY-MM-DD for the native date input
  const formattedDate = isValidDate
    ? new Date(task.dueDate!).toISOString().split('T')[0]
    : '';

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

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-3 hover:shadow-md transition-shadow ${updateTask.isPending ? 'opacity-60 pointer-events-none' : ''}`}>
      <h4 className="font-semibold text-gray-800 text-sm leading-snug">{title}</h4>

      {/* Status Dropdown */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</label>
        <select
          value={task.status || 'todo'}
          onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
          className="text-xs bg-gray-50 border border-gray-200 text-gray-700 rounded-lg p-1.5 font-medium focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Role Dropdown */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Assigned Role</label>
        <select
          value={task.role || 'nurse'}
          onChange={(e) => handleRoleChange(e.target.value as Role)}
          className="text-xs bg-gray-50 border border-gray-200 text-gray-700 rounded-lg p-1.5 font-medium focus:ring-blue-500 focus:border-blue-500 transition-colors capitalize"
        >
          <option value="nurse">Nurse</option>
          <option value="dietician">Dietician</option>
          <option value="social_worker">Social Worker</option>
        </select>
      </div>

      {/* Due Date Picker */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Due Date</label>
        <input
          type="date"
          value={formattedDate}
          onChange={(e) => handleDueDateChange(e.target.value)}
          className="text-xs bg-gray-50 border border-gray-200 text-gray-700 rounded-lg p-1.5 font-medium focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>
    </div>
  );
};
