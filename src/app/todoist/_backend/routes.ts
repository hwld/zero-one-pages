export const TodoistAPI = {
  base: "/todoist/api",
  projects: () => `${TodoistAPI.base}/projects` as const,
  project: (id?: string) => `${TodoistAPI.projects()}/${id ?? ":id"}`,
} as const;
