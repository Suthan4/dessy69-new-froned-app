import { QueryClient } from "@tanstack/react-query";
import { QUERY_CLIENT_CONFIG } from "./constants";

export const queryClient = new QueryClient(QUERY_CLIENT_CONFIG);

// Helper function to invalidate multiple queries
export const invalidateQueries = async (keys: string[]): Promise<void> => {
  await Promise.all(
    keys.map((key) => queryClient.invalidateQueries({ queryKey: [key] }))
  );
};

// Helper function to reset queries
export const resetQueries = (): void => {
  queryClient.clear();
};

// Helper function to get query data
export const getQueryData = <T = unknown>(key: string): T | undefined => {
  return queryClient.getQueryData<T>([key]);
};

// Helper function to set query data
export const setQueryData = <T = unknown>(key: string, data: T): void => {
  queryClient.setQueryData([key], data);
};
