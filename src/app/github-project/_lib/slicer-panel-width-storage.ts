const getKey = (viewId: string) => `slicer-panel-width-${viewId}` as const;

export const SlicerPanelWidthStorage = {
  get: (viewId: string): number | undefined => {
    const value = Number(localStorage.getItem(getKey(viewId)));
    return isNaN(value) ? undefined : value;
  },

  set: ({ viewId, width }: { viewId: string; width: number }) => {
    localStorage.setItem(getKey(viewId), width.toString());
  },

  remove: (viewId: string) => {
    localStorage.removeItem(getKey(viewId));
  },
};
