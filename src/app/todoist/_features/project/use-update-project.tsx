import { useMutation } from "@tanstack/react-query";
import { updateProject } from "../../_backend/project/api";
import { UpdateProjectInput } from "../../_backend/project/schema";

export const useUpdateProject = () => {
  return useMutation({
    mutationFn: (data: UpdateProjectInput) => {
      return updateProject(data);
    },
  });
};
