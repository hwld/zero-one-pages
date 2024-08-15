import { Event } from "../../_backend/event-store";
import { DragDateRange } from "../../utils";

/**
 * 行内に表示されるイベント
 */
export type EventInRow = Event & {
  top: number;
  /** このイベントを表示する行全体の列数 */
  eventsRowCols: number;
  /** イベントが行内で表示を開始する列のインデックス   */
  displayStartCol: number;
  /** イベントが行内で表示を終了する列のインデックス */
  displayEndCol: number;
};

export type MoveEventInRowPreview = EventInRow & DragDateRange;

export type ResizeEventInRowPreview = EventInRow & {
  origin: "eventStart" | "eventEnd";
  updatedAt: number;
};
