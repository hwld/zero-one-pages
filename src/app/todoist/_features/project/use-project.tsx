import { useQuery } from "@tanstack/react-query";
import { useMswState } from "../../../_providers/msw-provider";
import { fetchProject } from "../../_backend/taskbox/project/api";

export const useProject = (id: string) => {
  const { isMockserverUp } = useMswState();

  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => {
      return fetchProject(id);
    },
    enabled: isMockserverUp,
  });
};
