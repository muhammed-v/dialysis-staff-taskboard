import { Patient, Task, TaskStatus } from '../types';
import { TaskColumn } from './TaskColumn';

interface PatientRowProps {
  patient: Patient;
  tasks: Task[];
}

export const PatientRow = ({ patient, tasks }: PatientRowProps) => {
  const statuses: TaskStatus[] = ['todo', 'in_progress', 'completed'];

  return (
    <div className="flex flex-col xl:flex-row gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Patient Info Sidebar */}
      <div className="w-full xl:w-56 flex-shrink-0 flex xl:flex-col gap-4 items-center xl:items-start border-b xl:border-b-0 xl:border-r border-gray-100 pb-4 xl:pb-0 xl:pr-6">
        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-gray-400 flex-shrink-0">
          {patient.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{patient.name}</h2>
          <div className="flex gap-3 text-sm text-gray-500 mt-1 whitespace-nowrap">
            <span className="font-medium">ID: {patient.id}</span>
            <span className="text-gray-300">•</span>
            <span>{patient.age ? `${patient.age} yrs` : 'Age N/A'}</span>
          </div>
        </div>
      </div>

      {/* Task Columns */}
      <div className="flex-1 flex gap-5 overflow-x-auto pb-2">
        {statuses.map(status => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter(t => t.status === status)}
          />
        ))}
      </div>
    </div>
  );
};
