import { useMutation } from "@tanstack/react-query";
import { createProject } from "../../_backend/project/api";
import { ProjectFormData } from "../../_backend/project/schema";

export const useCreateProject = () => {
  return useMutation({
    mutationFn: (data: ProjectFormData) => {
      return createProject(data);
    },
  });
};
