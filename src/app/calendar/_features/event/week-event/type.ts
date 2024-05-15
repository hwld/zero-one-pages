import { Event } from "@/app/calendar/_mocks/event-store";

/**
 * イベントを含む特定の週において、イベントの開始曜日と終了曜日を含めたイベント
 */
export type WeekEvent = Event & {
  top: number;
  startWeekDay: number;
  endWeekDay: number;
};
