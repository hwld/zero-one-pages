export const TodoistAPI = {
  base: "/todoist/api",
  projects: () => `${TodoistAPI.base}/projects` as const,
  project: (id?: string) => `${TodoistAPI.projects()}/${id ?? ":id"}` as const,
  changeProjectPosition: () =>
    `${TodoistAPI.projects()}/change-position` as const,

  tasks: () => `${TodoistAPI.base}/tasks` as const,
} as const;
