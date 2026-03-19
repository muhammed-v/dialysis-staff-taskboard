
export type Role = "nurse" | "dietician" | "social_worker";


export type TaskStatus = "todo" | "in_progress" | "completed";

export interface Patient {
  id: string;
  name: string;
  age?: number;
}

export interface Task {
  id: string;
  patientId: string;
  title: string;
  role: Role;
  status: TaskStatus;

  dueDate?: string;

  createdAt: string;
}
