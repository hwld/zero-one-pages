import { useMutation } from "@tanstack/react-query";
import { createProject } from "../../_backend/project/api";
import { CreateProjectInput } from "../../_backend/project/schema";

export const useCreateProject = () => {
  return useMutation({
    mutationFn: (data: CreateProjectInput) => {
      return createProject(data);
    },
  });
};
