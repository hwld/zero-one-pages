import { useMutation } from "@tanstack/react-query";
import { updateProject } from "../../_backend/taskbox/project/api";
import { UpdateProjectInput } from "../../_backend/taskbox/project/schema";

export const useUpdateProject = () => {
  return useMutation({
    mutationFn: (data: UpdateProjectInput & { id: string }) => {
      return updateProject(data);
    },
  });
};
