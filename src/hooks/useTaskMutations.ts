import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, updateTask } from '../api/client';
import { Task } from '../types';
import type { CreateTaskInput } from '../api/mockBackend';
import toast from 'react-hot-toast';

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, { patientId: string; input: CreateTaskInput }>({
    mutationFn: ({ patientId, input }) => createTask(patientId, input),

    // Structure for Future 

    onMutate: async (_newVariables) => {

    },
    onError: (_err, _newVariables, _context) => {
      toast.error('Failed to create task. Please try again.');
    },
    onSettled: (_data, _error, variables) => {
      if (!_error) toast.success('Task created!');
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.patientId] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  // The 4th generic type argument defines the Context object we pass from onMutate to onError
  return useMutation<
    Task,
    Error,
    { taskId: string; patientId: string; updates: Partial<Task> },
    { previousTasks: Task[] | undefined }
  >({
    mutationFn: ({ taskId, updates }) => updateTask(taskId, updates),

    onMutate: async (newVariables) => {
      const queryKey = ['tasks', newVariables.patientId];

      // Cancel any outgoing queries so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous task list for this specific patient
      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      // Optimistically update the cache instantly to make the UI feel snappy
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(
          queryKey,
          previousTasks.map(task =>
            // If it's the target task, merge the new optimistic fields over it
            task.id === newVariables.taskId
              ? { ...task, ...newVariables.updates }
              : task
          )
        );
      }

      // Return context containing the snapshotted value to use in case of failure
      return { previousTasks };
    },
    onError: (err, newVariables, context) => {
      // Rollback cache using the snapshot context since the API request failed
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', newVariables.patientId], context.previousTasks);
      }

      // Show error message as requested
      toast.error(`Failed to update task: ${err.message}. Changes rolled back.`);
    },
    onSettled: (_data, _error, variables) => {
      if (!_error) toast.success('Task updated!');
      // Always resync with the server strictly as a final guarantee, regardless of success/fail
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.patientId] });
    },
  });
};
