import { queryOptions } from "@tanstack/react-query";
import { fetchView } from "../_backend/view/api";
import { useQuery } from "@tanstack/react-query";

export const viewQueryOption = (id: string) =>
  queryOptions({
    queryKey: ["views", id],
    queryFn: () => {
      return fetchView(id);
    },
  });

export const useView = (id?: string) => {
  return useQuery({
    ...viewQueryOption(id!),
    enabled: !!id,
  });
};
