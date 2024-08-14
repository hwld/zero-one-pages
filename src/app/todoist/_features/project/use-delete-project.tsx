import { useMutation } from "@tanstack/react-query";

export const useDeleteProject = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      throw new Error(`TODO: delete ${id}`);
    },
  });
};
