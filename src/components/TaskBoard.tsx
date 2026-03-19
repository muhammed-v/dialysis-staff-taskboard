import { useState } from 'react';
import { PatientRow } from './PatientRow';
import { usePatients } from '../hooks/usePatients';
import { Filters } from './Filters';
import { TimeFilter, RoleFilter } from '../utils/filterTasks';
import { LayoutDashboard, Loader2, AlertTriangle, Users } from 'lucide-react';

export const TaskBoard = () => {
  const { data: patients, isLoading, error, refetch } = usePatients();

  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading patients…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur border border-red-200 rounded-xl p-6 max-w-lg mx-auto mt-20 shadow-lg shadow-red-100/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-red-800 font-semibold text-sm">Failed to load patients</p>
            <p className="text-red-500 text-xs mt-0.5">{error?.message || 'Unknown error'}</p>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className="mt-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition shadow-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!patients || patients.length === 0) {
    return (
      <div className="text-center mt-20">
        <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <p className="text-lg font-medium text-slate-400">No patients found</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Taskboard</h1>
            <p className="text-slate-400 text-sm">Manage patient care tasks across your team.</p>
          </div>
        </div>

        <Filters
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
        />
      </div>

      {/* Patient List */}
      <div className="flex flex-col gap-5">
        {patients?.map(patient => {
          if (!patient?.id) return null;
          return (
            <PatientRow
              key={patient.id}
              patient={patient}
              filterOptions={{ time: timeFilter, role: roleFilter }}
            />
          );
        })}
      </div>
    </div>
  );
};
