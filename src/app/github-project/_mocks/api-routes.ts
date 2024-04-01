export const GitHubProjectAPI = {
  base: "/github-project/api",
  views: () => `${GitHubProjectAPI.base}/views`,
  view: (id?: string) => `${GitHubProjectAPI.views()}/${id ?? ":id"}`,
  tasks: () => `${GitHubProjectAPI.base}/tasks`,
  task: (id?: string) => `${GitHubProjectAPI.tasks()}/${id ?? ":id"}`,
} as const;
