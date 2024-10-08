import { useMutation } from "@tanstack/react-query";
import { deleteProject } from "../../_backend/taskbox/project/api";

export const useDeleteProject = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      return deleteProject(id);
    },
  });
};
