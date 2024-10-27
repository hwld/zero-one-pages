import { fetchTask } from "../_backend/api";
import { useMswQuery } from "../../../lib/useMswQuery";

export const useTask = (id: string) => {
  return useMswQuery({
    queryKey: ["tasks", id],
    queryFn: () => {
      return fetchTask(id);
    },
  });
};
