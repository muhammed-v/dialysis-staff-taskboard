import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdateTask } from '../hooks/useTaskMutations';
import * as apiClient from '../api/client';
import { Task } from '../types';
import React from 'react';

// Mock the API client module
vi.mock('../api/client');

// Mock react-hot-toast to prevent side effects in tests
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import toast from 'react-hot-toast';

const mockTask: Task = {
  id: 't1',
  patientId: 'p1',
  title: 'Check vitals',
  role: 'nurse',
  status: 'todo',
  createdAt: new Date().toISOString(),
};

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useUpdateTask – optimistic update with rollback', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  it('optimistically updates the cache before the server responds', async () => {
    // Seed the cache with the task
    queryClient.setQueryData(['tasks', 'p1'], [mockTask]);

    // Make the API call hang (never resolve yet)
    const apiPromise = new Promise<Task>(() => {});
    vi.mocked(apiClient.updateTask).mockReturnValue(apiPromise);

    const { result } = renderHook(() => useUpdateTask(), {
      wrapper: createWrapper(queryClient),
    });

    // Trigger the mutation
    act(() => {
      result.current.mutate({
        taskId: 't1',
        patientId: 'p1',
        updates: { status: 'completed' },
      });
    });

    // The cache should be optimistically updated immediately
    await waitFor(() => {
      const cached = queryClient.getQueryData<Task[]>(['tasks', 'p1']);
      expect(cached).toBeDefined();
      expect(cached![0].status).toBe('completed');
    });
  });

  it('rolls back the cache when the server returns an error', async () => {
    // Seed the cache with the original task
    queryClient.setQueryData(['tasks', 'p1'], [mockTask]);

    // Make the API call reject
    vi.mocked(apiClient.updateTask).mockRejectedValue(new Error('Server error'));

    const { result } = renderHook(() => useUpdateTask(), {
      wrapper: createWrapper(queryClient),
    });

    // Trigger the mutation
    act(() => {
      result.current.mutate({
        taskId: 't1',
        patientId: 'p1',
        updates: { status: 'completed' },
      });
    });

    // Wait for the mutation to settle and rollback
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Cache should be rolled back to the original value
    const cached = queryClient.getQueryData<Task[]>(['tasks', 'p1']);
    expect(cached).toBeDefined();
    expect(cached![0].status).toBe('todo'); // Rolled back from 'completed'

    // Error toast should have been fired
    expect(toast.error).toHaveBeenCalledWith(
      expect.stringContaining('Server error')
    );
  });

  it('shows a success toast when the mutation succeeds', async () => {
    queryClient.setQueryData(['tasks', 'p1'], [mockTask]);

    const updatedTask = { ...mockTask, status: 'completed' as const };
    vi.mocked(apiClient.updateTask).mockResolvedValue(updatedTask);

    const { result } = renderHook(() => useUpdateTask(), {
      wrapper: createWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        taskId: 't1',
        patientId: 'p1',
        updates: { status: 'completed' },
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(toast.success).toHaveBeenCalledWith('Task updated!');
  });
});
