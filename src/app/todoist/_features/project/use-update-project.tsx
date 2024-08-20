import { useMutation } from "@tanstack/react-query";
import { updateProject } from "../../_backend/project/api";
import { ProjectFormData } from "../../_backend/project/schema";

export const useUpdateProject = () => {
  return useMutation({
    mutationFn: (data: ProjectFormData & { id: string }) => {
      return updateProject(data);
    },
  });
};
