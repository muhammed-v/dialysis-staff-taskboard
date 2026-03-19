import { Task, Role } from '../types';

export type TimeFilter = 'all' | 'overdue' | 'today' | 'upcoming';
export type RoleFilter = 'all' | Role;

export interface FilterOptions {
  time: TimeFilter;
  role: RoleFilter;
}

export const filterTasks = (tasks: Task[], options: FilterOptions): Task[] => {
  return tasks.filter(task => {
    // Role Filter
    if (options.role !== 'all' && task.role !== options.role) {
      return false;
    }

    // Time Filter
    if (options.time !== 'all') {
      if (!task.dueDate) {
        // Edge Case: If a task has no due date, it theoretically has no "time context".
        // It cannot be overdue, today, or upcoming, so we filter it out if a specific time filter is exclusively applied.
        return false;
      }

      const dueDate = new Date(task.dueDate);

      // Edge Case: Invalid date string prevents crashing
      if (isNaN(dueDate.getTime())) {
        return false;
      }

      // Calculate relative timeframe boundaries
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize 'today' to the very start of the day

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow

      if (options.time === 'overdue') {
        // Any date fully prior to today is overdue
        if (dueDate >= today) return false;
      } else if (options.time === 'today') {
        // Falls exactly on today's calendar date
        if (dueDate < today || dueDate >= tomorrow) return false;
      } else if (options.time === 'upcoming') {
        // Everything falling on tomorrow or later
        if (dueDate < tomorrow) return false;
      }
    }

    return true;
  });
};
