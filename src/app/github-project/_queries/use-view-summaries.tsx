import { queryOptions } from "@tanstack/react-query";
import { fetchViewSummaries } from "../_backend/view/api";
import { useQuery } from "@tanstack/react-query";

export const viewSummariesQueryOption = queryOptions({
  queryKey: ["view-summaries"],
  queryFn: () => {
    return fetchViewSummaries();
  },
});

export const useViewSummaries = () => {
  return useQuery(viewSummariesQueryOption);
};
