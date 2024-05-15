import { DateEvent } from "./_features/event/date-event/type";

// TODO: weekly-calendarでしかつかってない。
export type MoveEventPreview = DateEvent & {
  prevMouseOverDate: Date;
  updatedAt: number;
};

export type ResizeEventPreview = DateEvent & {
  origin: "eventStart" | "eventEnd";
  updatedAt: number;
};
