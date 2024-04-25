export type Event = { id: string; title: string; start: Date; end: Date };
export type WeekEvent = Event & {
  top: number;
  startWeekDay: number;
  endWeekDay: number;
};
export type DateEvent = Event & {
  prevOverlappings: number;
  totalOverlappings: number;
};
