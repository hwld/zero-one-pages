const KEY = "task-detail-panel-width" as const;

export const TaskDetailPanelWidthStorage = {
  get: (): number | undefined => {
    const value = Number(localStorage.getItem(KEY));
    return isNaN(value) ? undefined : value;
  },

  set: (width: number) => {
    localStorage.setItem(KEY, width.toString());
  },
};
