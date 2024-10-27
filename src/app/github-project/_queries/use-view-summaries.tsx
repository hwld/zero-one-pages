import { queryOptions } from "@tanstack/react-query";
import { fetchViewSummaries } from "../_backend/view/api";
import { useMswQuery } from "../../../lib/useMswQuery";

export const viewSummariesQueryOption = queryOptions({
  queryKey: ["view-summaries"],
  queryFn: () => {
    return fetchViewSummaries();
  },
});

export const useViewSummaries = () => {
  return useMswQuery(viewSummariesQueryOption);
};
