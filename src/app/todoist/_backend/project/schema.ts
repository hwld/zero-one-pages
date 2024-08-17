import { z } from "zod";

// TODO: parentIdとかorderを指定できるようにする
export const projectFormSchema = z.object({
  label: z
    .string()
    .min(1, "プロジェクト名を入力してください")
    .max(120, "プロジェクト名は120文字以内で入力してください"),
});
export type ProjectFormData = z.infer<typeof projectFormSchema>;

export const projectPositionChangeSchema = z.object({
  projectId: z.string(),
  order: z.number(),
  parentProjectId: z.string().nullable(),
});

export type ProjectPositionChange = z.infer<typeof projectPositionChangeSchema>;
