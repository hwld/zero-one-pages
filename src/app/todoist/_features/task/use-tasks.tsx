import { useQuery } from "@tanstack/react-query";
import { useMswState } from "../../../_providers/msw-provider";
import { fetchTasks } from "../../_backend/task/api";

export const useTasks = () => {
  const { isMockserverUp } = useMswState();

  return useQuery({
    queryKey: ["tasks"],
    queryFn: () => {
      return fetchTasks();
    },
    enabled: isMockserverUp,
  });
};
