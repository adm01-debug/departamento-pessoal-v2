// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UseCRUDOptions<T> {
  table: string;
  select?: string;
  initialData?: T[];
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export function useCRUD<T extends { id: string }>(options: UseCRUDOptions<T>) {
  const { table, select = '*', initialData, onSuccess, onError } = options;
  const queryClient = useQueryClient();

  // Fetch all items
  const useAll = () => {
    return useQuery<T[]>({
      queryKey: [table],
      queryFn: async () => {
        const { data, error } = await supabase.from(table).select(select);
        if (error) {
          console.error(`Error fetching ${table}:`, error);
          throw error;
        }
        return data || [];
      },
      initialData: initialData,
    });
  };

  // Fetch a single item by ID
  const useById = (id: string) => {
    return useQuery<T>({
      queryKey: [table, id],
      queryFn: async () => {
        const { data, error } = await supabase.from(table).select(select).eq('id', id).single();
        if (error) {
          console.error(`Error fetching ${table} with id ${id}:`, error);
          throw error;
        }
        return data || null;
      },
      enabled: !!id,
    });
  };

  // Create a new item
  const useCreate = () => {
    return useMutation<T, any, Omit<T, 'id'>>({
      mutationFn: async (newItem: Omit<T, 'id'>) => {
        const { data, error } = await supabase.from(table).insert([newItem]).select(select).single();
        if (error) {
          console.error(`Error creating ${table}:`, error);
          throw error;
        }
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [table] });
        if (onSuccess) onSuccess();
      },
      onError: (error) => {
        console.error(`Error in useCreate mutation for ${table}:`, error);
        if (onError) onError(error);
      },
    });
  };

  // Update an existing item
  const useUpdate = () => {
    return useMutation<T, any, { id: string; updates: Partial<T> }>({
      mutationFn: async ({ id, updates }) => {
        const { data, error } = await supabase.from(table).update(updates).eq('id', id).select(select).single();
        if (error) {
          console.error(`Error updating ${table} with id ${id}:`, error);
          throw error;
        }
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [table] });
        if (onSuccess) onSuccess();
      },
      onError: (error) => {
        console.error(`Error in useUpdate mutation for ${table}:`, error);
        if (onError) onError(error);
      },
    });
  };

  // Delete an item
  const useDelete = () => {
    return useMutation<void, any, string>({
      mutationFn: async (id: string) => {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) {
          console.error(`Error deleting ${table} with id ${id}:`, error);
          throw error;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [table] });
        if (onSuccess) onSuccess();
      },
      onError: (error) => {
        console.error(`Error in useDelete mutation for ${table}:`, error);
        if (onError) onError(error);
      },
    });
  };

  return {
    useAll,
    useById,
    useCreate,
    useUpdate,
    useDelete,
  };
}
