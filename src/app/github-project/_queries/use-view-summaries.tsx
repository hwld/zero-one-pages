import { useQuery } from "@tanstack/react-query";
import { fetchViewSummaries } from "../_mocks/view/api";
import { useMswState } from "@/app/_providers/msw-provider";

export const useViewSummaries = () => {
  const { isMockserverUp } = useMswState();

  return useQuery({
    queryKey: ["view-summaries"],
    queryFn: () => {
      return fetchViewSummaries();
    },
    enabled: isMockserverUp,
  });
};
