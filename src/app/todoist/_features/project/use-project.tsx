import { queryOptions, useQuery } from "@tanstack/react-query";
import { useMswState } from "../../../_providers/msw-provider";
import { fetchProject } from "../../_backend/taskbox/project/api";

export const projectQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["projects", id],
    queryFn: () => {
      return fetchProject(id);
    },
  });

export const useProject = (id: string) => {
  const { isMockserverUp } = useMswState();

  return useQuery({
    ...projectQueryOptions(id),
    enabled: isMockserverUp,
  });
};
