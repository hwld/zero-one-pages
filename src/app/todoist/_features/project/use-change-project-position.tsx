import { useMutation } from "@tanstack/react-query";
import { changeProjectsPosition } from "../../_backend/project/api";
import { ProjectPositionChange } from "../../_backend/project/schema";

export const useChangeProjectPosition = () => {
  return useMutation({
    mutationFn: (data: ProjectPositionChange[]) => {
      return changeProjectsPosition(data);
    },
  });
};
