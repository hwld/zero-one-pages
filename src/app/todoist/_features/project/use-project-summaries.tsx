import { useQuery } from "@tanstack/react-query";
import { fetchProjectSummaries } from "../../_backend/project/api";

export const useProjectSummaries = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => {
      return fetchProjectSummaries();
    },
  });
};
