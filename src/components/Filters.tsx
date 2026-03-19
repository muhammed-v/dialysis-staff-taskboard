import { Filter, Clock } from 'lucide-react';
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
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
        <Filter className="h-3.5 w-3.5 text-emerald-500" />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
          className="text-sm bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
        >
          {roles.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
        <Clock className="h-3.5 w-3.5 text-teal-500" />
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
          className="text-sm bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
        >
          {times.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
