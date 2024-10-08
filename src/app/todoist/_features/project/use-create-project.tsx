import { useMutation } from "@tanstack/react-query";
import { createProject } from "../../_backend/taskbox/project/api";
import { CreateProjectInput } from "../../_backend/taskbox/project/schema";

export const useCreateProject = () => {
  return useMutation({
    mutationFn: (input: CreateProjectInput) => {
      return createProject(input);
    },
  });
};
