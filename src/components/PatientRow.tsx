import { Patient, TaskStatus } from '../types';
import { TaskColumn } from './TaskColumn';
import { useTasks } from '../hooks/useTasks';
import { FilterOptions, filterTasks } from '../utils/filterTasks';

interface PatientRowProps {
  patient: Patient;
  filterOptions: FilterOptions;
}

export const PatientRow = ({ patient, filterOptions }: PatientRowProps) => {
  const statuses: TaskStatus[] = ['todo', 'in_progress', 'completed'];
  
  // Extract refetch to allow manual retries per patient row
  const { data: rawTasks, isLoading, error, refetch } = useTasks(patient?.id);
  
  // Apply filtering robustly
  const tasks = rawTasks ? filterTasks(rawTasks, filterOptions) : [];

  return (
    <div className="flex flex-col xl:flex-row gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-200 relative overflow-hidden">
      {/* Patient Info Sidebar */}
      <div className="w-full xl:w-56 flex-shrink-0 flex xl:flex-col gap-4 items-center xl:items-start border-b xl:border-b-0 xl:border-r border-gray-100 pb-4 xl:pb-0 xl:pr-6">
        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-gray-400 flex-shrink-0">
          {patient?.name?.charAt(0) || '?'}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{patient?.name || 'Unknown Patient'}</h2>
          <div className="flex gap-3 text-sm text-gray-500 mt-1 whitespace-nowrap">
            <span className="font-medium">ID: {patient?.id || 'N/A'}</span>
            <span className="text-gray-300">•</span>
            <span>{patient?.age ? `${patient.age} yrs` : 'Age N/A'}</span>
          </div>
        </div>
      </div>

      {/* Task Columns */}
      <div className="flex-1 flex gap-5 overflow-x-auto pb-2 relative min-h-[150px]">
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 flex flex-col gap-3 items-center justify-center z-10 backdrop-blur-[1px] rounded-r-xl">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
             <span className="text-sm font-medium text-gray-500">Loading tasks...</span>
          </div>
        )}
        
        {/* Error Overlay with User-friendly Retry Mechanism */}
        {error && (
          <div className="absolute inset-0 bg-red-50/95 flex flex-col gap-2 items-center justify-center z-10 rounded-r-xl text-red-700 border border-red-100 p-4 text-center">
             <span className="font-bold text-base">Failed to sync tasks</span>
             <span className="text-sm opacity-90 max-w-[80%]">{error?.message || 'Network error'}</span>
             <button 
               onClick={() => refetch()}
               className="px-4 py-1.5 mt-2 bg-red-100 border border-red-200 text-red-800 hover:bg-red-200 rounded-lg text-xs font-bold transition shadow-sm"
             >
               Retry
             </button>
          </div>
        )}

        {statuses.map(status => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks?.filter(t => t?.status === status) || []}
          />
        ))}
      </div>
    </div>
  );
};
