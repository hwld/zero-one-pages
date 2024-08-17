import { useMutation } from "@tanstack/react-query";
import { ProjectFormData, updateProject } from "../../_backend/project/api";

export const useUpdateProject = () => {
  return useMutation({
    mutationFn: (data: ProjectFormData & { id: string }) => {
      return updateProject(data);
    },
  });
};
