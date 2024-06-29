import { z } from "zod";

export const HomeSearchParamsSchema = z.object({
  viewId: z.string().optional(),
});
type HomeSearchParams = z.infer<typeof HomeSearchParamsSchema>;

export const DetailSearchParamsSchema = z.object({
  viewId: z.string().optional(),
  panel: z.literal("detail").optional(),
  taskId: z.string().optional(),
});
type DetailSearchParams = z.infer<typeof DetailSearchParamsSchema>;

export const Routes = {
  base: `/github-project` as const,

  home: (params: HomeSearchParams) => {
    const searchParams = new URLSearchParams(params);

    return `${Routes.base}?${searchParams.toString()}` as const;
  },

  detail: (params: Omit<DetailSearchParams, "panel">) => {
    const fullParams: DetailSearchParams = { ...params, panel: "detail" };
    const searchParams = new URLSearchParams(fullParams);

    return `${Routes.base}?${searchParams.toString()}` as const;
  },
} as const;
