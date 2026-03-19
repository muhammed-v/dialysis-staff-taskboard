import { describe, it, expect } from 'vitest';
import { filterTasks, FilterOptions } from '../utils/filterTasks';
import { Task } from '../types';

// Helper to build a task with sensible defaults
const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: 't1',
  patientId: 'p1',
  title: 'Test Task',
  role: 'nurse',
  status: 'todo',
  createdAt: new Date().toISOString(),
  ...overrides,
});

describe('filterTasks', () => {
  const tasks: Task[] = [
    makeTask({ id: 't1', role: 'nurse', status: 'todo', dueDate: new Date(Date.now() - 86400000).toISOString() }), // yesterday (overdue)
    makeTask({ id: 't2', role: 'dietician', status: 'in_progress', dueDate: new Date().toISOString() }), // today
    makeTask({ id: 't3', role: 'social_worker', status: 'completed', dueDate: new Date(Date.now() + 172800000).toISOString() }), // upcoming
    makeTask({ id: 't4', role: 'nurse', status: 'todo' }), // no dueDate
  ];

  // Role Filter 

  it('returns all tasks when role filter is "all"', () => {
    const options: FilterOptions = { role: 'all', time: 'all' };
    expect(filterTasks(tasks, options)).toHaveLength(4);
  });

  it('filters tasks by role "nurse"', () => {
    const options: FilterOptions = { role: 'nurse', time: 'all' };
    const result = filterTasks(tasks, options);
    expect(result).toHaveLength(2);
    expect(result.every(t => t.role === 'nurse')).toBe(true);
  });

  it('filters tasks by role "dietician"', () => {
    const options: FilterOptions = { role: 'dietician', time: 'all' };
    const result = filterTasks(tasks, options);
    expect(result).toHaveLength(1);
    expect(result[0].role).toBe('dietician');
  });

  // Time Filter 

  it('filters overdue tasks correctly', () => {
    const options: FilterOptions = { role: 'all', time: 'overdue' };
    const result = filterTasks(tasks, options);
    // Only t1 (yesterday) should be overdue. t4 has no dueDate and should be excluded.
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('t1');
  });

  it('filters upcoming tasks correctly', () => {
    const options: FilterOptions = { role: 'all', time: 'upcoming' };
    const result = filterTasks(tasks, options);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('t3');
  });

  // Edge Cases

  it('excludes tasks with missing dueDate when a time filter is active', () => {
    const options: FilterOptions = { role: 'all', time: 'overdue' };
    const result = filterTasks(tasks, options);
    expect(result.find(t => t.id === 't4')).toBeUndefined();
  });

  it('excludes tasks with invalid dueDate strings', () => {
    const badTasks = [makeTask({ id: 'bad', dueDate: 'not-a-date' })];
    const options: FilterOptions = { role: 'all', time: 'overdue' };
    expect(filterTasks(badTasks, options)).toHaveLength(0);
  });

  it('returns empty array for empty input', () => {
    const options: FilterOptions = { role: 'all', time: 'all' };
    expect(filterTasks([], options)).toEqual([]);
  });

  // Combined Filters

  it('combines role and time filters correctly', () => {
    const options: FilterOptions = { role: 'nurse', time: 'overdue' };
    const result = filterTasks(tasks, options);
    // Only t1 is both nurse AND overdue
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('t1');
    expect(result[0].role).toBe('nurse');
  });
});
