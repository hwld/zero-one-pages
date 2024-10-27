import { queryOptions } from "@tanstack/react-query";
import { fetchView } from "../_backend/view/api";
import { useMswQuery } from "../../../lib/useMswQuery";

export const viewQueryOption = (id: string) =>
  queryOptions({
    queryKey: ["views", id],
    queryFn: () => {
      return fetchView(id);
    },
  });

export const useView = (id?: string) => {
  return useMswQuery({
    ...viewQueryOption(id!),
    enabled: !!id,
  });
};
