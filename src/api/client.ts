import { Patient, Task } from '../types';
import * as mockBackend from './mockBackend';

//Normalizes a Task object coming from the backend. Ensures that missing or corrupted critical fields are given safe fallbacks. so the React UI doesn't crash (e.g., when the mock backend strips titles).

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeTask = (task: any): Task => {
  return {
    ...task,
    // Provide fallback for corrupted/missing title
    title: task.title || 'Untitled Task',
    // The dueDate was occasionally stripped by the imperfect backend,
    // but the TypeScript interface allows it to be optional, so no fallback needed.
  } as Task;
};

// Standardizes API errors into a consistent Error object that React Query can predictably consume.
const handleApiError = (error: unknown): never => {
  if (error instanceof Error) {
    throw error;
  }
  throw new Error(typeof error === 'string' ? error : 'An unknown API error occurred');
};


// Exported Client Functions

export const fetchPatients = async (): Promise<Patient[]> => {
  try {
    return await mockBackend.getPatients();
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchTasks = async (patientId: string): Promise<Task[]> => {
  try {
    const rawTasks = await mockBackend.getTasksByPatient(patientId);
    return rawTasks.map(normalizeTask);
  } catch (error) {
    return handleApiError(error);
  }
};

export const createTask = async (patientId: string, input: mockBackend.CreateTaskInput): Promise<Task> => {
  try {
    const rawTask = await mockBackend.createTask(patientId, input);
    return normalizeTask(rawTask);
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task> => {
  try {
    const rawTask = await mockBackend.updateTask(taskId, updates);
    return normalizeTask(rawTask);
  } catch (error) {
    return handleApiError(error);
  }
};
