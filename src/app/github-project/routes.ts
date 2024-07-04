import { z } from "zod";

export const HomeSearchParamsSchema = z.object({
  viewId: z.string().optional(),
  panel: z.literal("detail").optional(),
  taskId: z.string().optional(),
});
type HomeSearchParams = z.infer<typeof HomeSearchParamsSchema>;

export const Routes = {
  base: `/github-project` as const,

  home: (params: HomeSearchParams) => {
    const searchParams = new URLSearchParams(params);

    return `${Routes.base}?${searchParams.toString()}` as const;
  },
} as const;
