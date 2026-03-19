import { PatientRow } from './PatientRow';
import { Patient, Task } from '../types';


// DUMMY DATA FOR INITIAL LAYOUT TESTING

const dummyPatients: Patient[] = [
  { id: '1', name: 'James Wilson', age: 45 },
  { id: '2', name: 'Sarah Miller', age: 62 },
];

const dummyTasks: Task[] = [
  {
    id: 't1', patientId: '1', title: 'Administer Epogen exactly at 10:00 AM', role: 'nurse', status: 'todo',
    dueDate: new Date(Date.now() + 86400000).toISOString(), createdAt: new Date().toISOString()
  },
  {
    id: 't2', patientId: '1', title: 'Review weekly potassium levels', role: 'dietician', status: 'in_progress',
    createdAt: new Date().toISOString()
  },
  {
    id: 't3', patientId: '2', title: 'Verify transportation for Tuesday', role: 'social_worker', status: 'completed',
    createdAt: new Date().toISOString()
  },
  {
    id: 't4', patientId: '2', title: 'Check vitals post-dialysis', role: 'nurse', status: 'todo',
    createdAt: new Date().toISOString()
  },
];

export const TaskBoard = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Patient Taskboard</h1>
        <p className="text-gray-500 text-sm">Overview of all active and completed tasks across staff roles.</p>
      </div>

      <div className="flex flex-col gap-8">
        {dummyPatients.map(patient => (
          <PatientRow
            key={patient.id}
            patient={patient}
            tasks={dummyTasks.filter(t => t.patientId === patient.id)}
          />
        ))}
      </div>
    </div>
  );
};
