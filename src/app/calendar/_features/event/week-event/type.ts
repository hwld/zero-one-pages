import { Event } from "@/app/calendar/_mocks/event-store";
import { DragDateRange } from "../../utils";

/**
 * イベントを含む特定の週において、イベントの開始曜日と終了曜日を含めたイベント
 */
export type WeekEvent = Event & {
  top: number;
  startWeekDay: number;
  endWeekDay: number;
};

// TODO: eventをフラットにする
export type MoveWeekEventPreview = {
  event: WeekEvent;
} & DragDateRange;
