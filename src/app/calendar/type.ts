export type Event = { id: string; title: string; start: Date; end: Date };
export type WeekEvent = Event & {
  top: number;
  startWeekDay: number;
  endWeekDay: number;
};
