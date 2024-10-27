import { fetchTaskboxes } from "../../_backend/taskbox/api";
import { toTaskboxNodes } from "./taskbox";
import { useMswQuery } from "../../../../lib/useMswQuery";

export const useQueryTaskboxNodes = () => {
  return useMswQuery({
    queryKey: ["taskboxes"],
    queryFn: async () => {
      const boxes = await fetchTaskboxes();
      return toTaskboxNodes(boxes);
    },
  });
};
