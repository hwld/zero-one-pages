import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProjects } from "../../_backend/taskbox/project/api";
import { Project } from "../../_backend/taskbox/project/model";
import { useCallback } from "react";
import { useMswState } from "../../../_providers/msw-provider";

export const projectsQueryOptions = queryOptions({
  queryKey: ["projects"],
  queryFn: ({ signal }) => {
    return fetchProjects({ signal });
  },
});

export const useProjectsQuery = () => {
  const { isMockserverUp } = useMswState();
  const client = useQueryClient();

  const updateProjectsCache = useCallback(
    (callback: (projects: Project[]) => Project[]) => {
      client.cancelQueries({
        queryKey: projectsQueryOptions.queryKey,
      });

      client.setQueryData(projectsQueryOptions.queryKey, (old) => {
        return callback(old ?? []);
      });
    },
    [client],
  );

  const queryData = useQuery({
    ...projectsQueryOptions,
    enabled: isMockserverUp,
  });

  return { ...queryData, updateProjectsCache };
};
