import { useMoveDateEvent } from "./move-event-provider";
import { useResizeDateEvent } from "./resize-event-provider";
import { getDateEvents } from "./utils";
import { Event } from "@/app/calendar/_mocks/event-store";

/**
 *  日付を指定して、DateEventのMoveやResizeの状態から更新後のdate-eventsを返す
 */
export const useOptimisticDateEvents = ({
  day,
  events,
}: {
  day: Date;
  events: Event[];
}) => {
  const { resizeEventPreview } = useResizeDateEvent();
  const { isEventMoving, moveEventPreview } = useMoveDateEvent();

  return getDateEvents({
    date: day,
    // tanstack-queryのキャッシュレベルで実装すると、他の更新があったときに壊れてしまうので
    // 楽観的更新をここで実装する
    events: events.map((event): Event => {
      // イベントのリサイズがバックエンドに反映されていない場合は、リサイズ後のPreviewのデータを返したい
      const resizePreviewVisible = event.id === resizeEventPreview?.id;

      // イベントはUI上で移動中ではないが、イベントの移動がバックエンドに反映されていない場合は、移動後のPreviewのデータを返したい
      // resizeと違って、移動中にはPreviewを使って移動中のイベントを表示する専用のコンポーネントがあるので、移動中はPreviewのデータではなくEventをそのまま返す
      const movePreviewVisible =
        !isEventMoving && event.id === moveEventPreview?.id;

      if (isEventMoving && event.id === moveEventPreview?.id) {
        return event;
      }

      if (resizePreviewVisible && movePreviewVisible) {
        if (resizeEventPreview.updatedAt > moveEventPreview.updatedAt) {
          return resizeEventPreview;
        } else {
          return moveEventPreview;
        }
      }

      if (movePreviewVisible) {
        return moveEventPreview;
      }

      if (resizePreviewVisible) {
        return resizeEventPreview;
      }

      return event;
    }),
  });
};
