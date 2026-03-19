import { useQuery } from '@tanstack/react-query';
import { fetchPatients } from '../api/client';
import { Patient } from '../types';

export const usePatients = () => {
  return useQuery<Patient[], Error>({
    queryKey: ['patients'],
    queryFn: fetchPatients,
    // Explicitly set retry to aggressively combat the 
    // 20% artificial failure rate in our mock API
    retry: 3,
  });
};
