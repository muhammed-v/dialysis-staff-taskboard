import { PatientRow } from './PatientRow';
import { usePatients } from '../hooks/usePatients';

export const TaskBoard = () => {
  const { data: patients, isLoading, error } = usePatients();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-12 items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 font-medium mt-4">Loading patients...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl flex flex-col gap-2">
        <h3 className="font-bold text-lg">Error loading patient data</h3>
        <p>{error?.message || 'An unknown network error occurred.'}</p>
        <p className="text-sm mt-2 opacity-80">Our mock backend has an intentional 20% failure rate. React Query tried 3 times before failing completely!</p>
      </div>
    );
  }

  if (!patients || patients.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-200 p-12 rounded-2xl flex flex-col items-center justify-center text-gray-500">
        <p className="font-medium text-lg">No patients found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Patient Taskboard</h1>
        <p className="text-gray-500 text-sm">Overview of all active and completed tasks across staff roles.</p>
      </div>

      <div className="flex flex-col gap-8">
        {patients?.map(patient => (
          <PatientRow
            key={patient?.id}
            patient={patient}
          />
        ))}
      </div>
    </div>
  );
};
