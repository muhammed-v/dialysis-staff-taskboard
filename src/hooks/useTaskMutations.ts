import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, updateTask } from '../api/client';
import { Task } from '../types';
import type { CreateTaskInput } from '../api/mockBackend';

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, { patientId: string; input: CreateTaskInput }>({
    mutationFn: ({ patientId, input }) => createTask(patientId, input),

    // Structure for Future 

    onMutate: async (newVariables) => {

    },
    onError: (err, newVariables, context) => {

    },
    onSettled: (data, error, variables) => {

      queryClient.invalidateQueries({ queryKey: ['tasks', variables.patientId] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, { taskId: string; patientId: string; updates: Partial<Task> }>({
    mutationFn: ({ taskId, updates }) => updateTask(taskId, updates),


    onMutate: async (newVariables) => {

    },
    onError: (err, newVariables, context) => {

    },
    onSettled: (data, error, variables) => {


      queryClient.invalidateQueries({ queryKey: ['tasks', variables.patientId] });
    },
  });
};
