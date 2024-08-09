import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchProjects } from "../../_backend/project/api";

const projectsQueryOptions = queryOptions({
  queryKey: ["projects"],
  queryFn: () => {
    return fetchProjects();
  },
});

export const useProjects = () => {
  return useQuery(projectsQueryOptions);
};
