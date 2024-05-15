import { Event } from "@/app/calendar/_mocks/event-store";

/**
 * 日単位で表示するイベント
 */
export type DateEvent = Event & {
  prevOverlappings: number;
  totalOverlappings: number;
};
