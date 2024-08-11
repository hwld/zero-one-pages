import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProjects } from "../../_backend/project/api";
import { Project } from "../../_backend/project/model";
import { useCallback } from "react";
import { useMswState } from "@/app/_providers/msw-provider";

const projectsQueryOptions = queryOptions({
  queryKey: ["projects"],
  queryFn: () => {
    return fetchProjects();
  },
});

export const useProjects = () => {
  const { isMockserverUp } = useMswState();
  const client = useQueryClient();

  const updateProjectsCache = useCallback(
    (callback: (projects: Project[]) => Project[]) => {
      const oldProjects =
        client.getQueryData(projectsQueryOptions.queryKey) ?? [];
      client.setQueryData(projectsQueryOptions.queryKey, callback(oldProjects));
    },
    [client],
  );

  const queryData = useQuery({
    ...projectsQueryOptions,
    enabled: isMockserverUp,
  });

  return { ...queryData, updateProjectsCache };
};
