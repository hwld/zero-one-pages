import { Event } from "@/app/calendar/_mocks/event-store";
import { DragDateRange } from "../../utils";

/**
 * イベントを含む特定の週において、イベントの開始曜日と終了曜日を含めたイベント
 *
 * TODO:
 * 今は1週間単位で表示するためのイベントだけど、指定した範囲で表示できるようにする
 * WeekEventからMultiDateEventとかにする
 */
export type WeekEvent = Event & {
  top: number;
  eventsRowCols: number;
  displayStartCol: number;
  displayEndCol: number;
};

export type MoveWeekEventPreview = WeekEvent & DragDateRange;

export type ResizeWeekEventPreview = WeekEvent & {
  origin: "eventStart" | "eventEnd";
  updatedAt: number;
};
