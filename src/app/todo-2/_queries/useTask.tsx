import { useQuery } from "@tanstack/react-query";
import { fetchTask } from "../_mocks/api";

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => {
      return fetchTask(id);
    },
  });
};
