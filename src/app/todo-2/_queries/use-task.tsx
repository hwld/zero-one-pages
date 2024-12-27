import { fetchTask } from "../_backend/api";
import { useQuery } from "@tanstack/react-query";

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => {
      return fetchTask(id);
    },
  });
};
