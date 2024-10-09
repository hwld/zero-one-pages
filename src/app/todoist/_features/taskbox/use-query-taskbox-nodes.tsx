import { useQuery } from "@tanstack/react-query";
import { fetchTaskboxes } from "../../_backend/taskbox/api";
import { toTaskboxNodes } from "./taskbox";
import { useMswState } from "../../../_providers/msw-provider";

export const useQueryTaskboxNodes = () => {
  const { isMockserverUp } = useMswState();

  return useQuery({
    queryKey: ["taskboxes"],
    queryFn: async () => {
      const boxes = await fetchTaskboxes();
      return toTaskboxNodes(boxes);
    },
    enabled: isMockserverUp,
  });
};
