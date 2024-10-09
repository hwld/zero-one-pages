import { useQuery } from "@tanstack/react-query";
import { useMswState } from "../../../_providers/msw-provider";
import { fetchInbox } from "../../_backend/taskbox/inbox/api";

export const useInbox = () => {
  const { isMockserverUp } = useMswState();

  return useQuery({
    queryKey: ["inbox"],
    queryFn: () => {
      return fetchInbox();
    },
    enabled: isMockserverUp,
  });
};
