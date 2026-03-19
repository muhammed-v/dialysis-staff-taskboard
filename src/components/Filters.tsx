import { TimeFilter, RoleFilter } from '../utils/filterTasks';

interface FiltersProps {
  timeFilter: TimeFilter;
  setTimeFilter: (f: TimeFilter) => void;
  roleFilter: RoleFilter;
  setRoleFilter: (f: RoleFilter) => void;
}

export const Filters = ({ timeFilter, setTimeFilter, roleFilter, setRoleFilter }: FiltersProps) => {
  const roles: { value: RoleFilter; label: string }[] = [
    { value: 'all', label: 'All Roles' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'dietician', label: 'Dietician' },
    { value: 'social_worker', label: 'Social Worker' },
  ];

  const times: { value: TimeFilter; label: string }[] = [
    { value: 'all', label: 'Any Time' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'today', label: 'Today' },
    { value: 'upcoming', label: 'Upcoming' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-2">
      <div className="flex flex-col gap-1.5 flex-1">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Role Provider</label>
        <select 
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-3 font-medium transition-colors"
        >
          {roles.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5 flex-1">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Due Date</label>
        <select 
          value={timeFilter} 
          onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-3 font-medium transition-colors"
        >
          {times.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
