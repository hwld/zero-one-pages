import { Event } from "@/app/calendar/_mocks/event-store";

/**
 * 列内に表示されるイベント
 */
export type EventInCol = Event & {
  prevOverlappings: number;
  totalOverlappings: number;
};

export type MoveEventInColPreview = EventInCol & {
  prevMouseOverDate: Date;
  updatedAt: number;
};

export type ResizeEventInColPreview = EventInCol & {
  origin: "eventStart" | "eventEnd";
  updatedAt: number;
};
