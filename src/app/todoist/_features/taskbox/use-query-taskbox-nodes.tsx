import { fetchTaskboxes } from "../../_backend/taskbox/api";
import { toTaskboxNodes } from "./taskbox";
import { useQuery } from "@tanstack/react-query";

export const useQueryTaskboxNodes = () => {
  return useQuery({
    queryKey: ["taskboxes"],
    queryFn: async () => {
      const boxes = await fetchTaskboxes();
      return toTaskboxNodes(boxes);
    },
  });
};
