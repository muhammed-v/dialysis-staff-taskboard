import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '../api/client';
import { Task } from '../types';

export const useTasks = (patientId: string) => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks', patientId],
    queryFn: () => fetchTasks(patientId),
    retry: 3, // Handle our mock backend's arbitrary 20% errors
    enabled: !!patientId, // Ensure it doesn't fetch until we have a valid patient ID
  });
};
