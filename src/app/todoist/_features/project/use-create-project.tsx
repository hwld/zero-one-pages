import { useMutation } from "@tanstack/react-query";
import { createProject, ProjectFormData } from "../../_backend/project/api";

export const useCreateProject = () => {
  return useMutation({
    mutationFn: (data: ProjectFormData) => {
      return createProject(data);
    },
  });
};
