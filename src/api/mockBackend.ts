import { Patient, Task, Role, TaskStatus } from '../types';

// Mock in-memory database
let patients: Patient[] = [
  { id: 'p1', name: 'John Doe', age: 45 },
  { id: 'p2', name: 'Jane Smith', age: 62 },
  { id: 'p3', name: 'Alice Johnson', age: 58 },
  { id: 'p4', name: 'Robert Brown' } // Optional age omitted intentionally
];

let tasks: Task[] = [
  {
    id: 't1',
    patientId: 'p1',
    title: 'Check vitals morning shift',
    role: 'nurse',
    status: 'completed',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 't2',
    patientId: 'p1',
    title: 'Consult on new renal diet plan',
    role: 'dietician',
    status: 'in_progress',
    createdAt: new Date().toISOString(), // No dueDate intentional
  },
  {
    id: 't3',
    patientId: 'p2',
    title: 'Weekly welfare check-in',
    role: 'social_worker',
    status: 'todo',
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    createdAt: new Date().toISOString(),
  },
];

// Artificial delay between 500ms and 1500ms
const simulateDelay = () => new Promise<void>(resolve => {
  const timeout = Math.floor(Math.random() * 1000) + 500;
  setTimeout(resolve, timeout);
});

// Simulate random network failure (~20% chance)
const simulateFailure = () => {
  if (Math.random() < 0.20) {
    throw new Error('MockBackendError: Simulated network failure occurred.');
  }
};

// Simulation of an imperfect backend.

const simulateImperfectData = (task: Task): Task => {
  const t = { ...task };

  // ~15% chance to pretend a dueDate was lost in the system
  if (Math.random() < 0.15 && t.dueDate) {
    delete t.dueDate;
  }

  // ~5% chance to aggressively drop the title to test partial object rendering resilience
  if (Math.random() < 0.05) {
    // We intentionally force a casting bypass here to test React UI boundaries
    // @ts-expect-error Intentionally creating an invalid object
    delete t.title;
  }

  return t;
};

// ======================================
// Exported API Functions
// ======================================

export const getPatients = async (): Promise<Patient[]> => {
  await simulateDelay();
  simulateFailure();
  return [...patients];
};

export const getTasksByPatient = async (patientId: string): Promise<Task[]> => {
  await simulateDelay();
  simulateFailure();

  const results = tasks.filter(t => t.patientId === patientId);
  return results.map(simulateImperfectData);
};

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt'>;

export const createTask = async (patientId: string, taskInput: CreateTaskInput): Promise<Task> => {
  await simulateDelay();
  simulateFailure();

  const newTask: Task = {
    ...taskInput,
    id: `newTask_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    patientId: patientId,
    createdAt: new Date().toISOString()
  };

  tasks = [...tasks, newTask];
  return simulateImperfectData(newTask);
};

export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task> => {
  await simulateDelay();
  simulateFailure();

  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    throw new Error(`Task with id ${taskId} could not be found to update`);
  }

  const updatedTask = { ...tasks[taskIndex], ...updates };

  // Update state immutably for our mock backend memory
  tasks = [...tasks.slice(0, taskIndex), updatedTask, ...tasks.slice(taskIndex + 1)];

  return simulateImperfectData(updatedTask);
};
