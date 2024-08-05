export const Routes = {
  base: () => "/todoist" as const,
  inbox: () => `${Routes.base()}/inbox` as const,
  today: () => `${Routes.base()}/today` as const,
  upcoming: () => `${Routes.base()}/upcoming` as const,
  filtersLabels: () => `${Routes.base()}/filters-labels` as const,
  myProjectList: () => `${Routes.base()}/my-project-list` as const,
  myProject: (id?: string) =>
    `${Routes.base()}/my-projects${id ? `?id=${id}` : ""}` as const,
} as const;
