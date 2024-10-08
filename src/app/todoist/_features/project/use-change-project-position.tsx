import { useMutation } from "@tanstack/react-query";
import { changeProjectsPosition } from "../../_backend/taskbox/project/api";
import { ProjectPositionChange } from "../../_backend/taskbox/project/schema";

export const useChangeProjectPosition = () => {
  return useMutation({
    mutationFn: (data: ProjectPositionChange[]) => {
      return changeProjectsPosition(data);
    },
  });
};
