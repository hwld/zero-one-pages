import { RefObject, useRef } from "react";
import {
  MoveEventInColProvider,
  useMoveEventInCol,
} from "../event-in-col/move-event-provider";
import {
  PrepareCreateEventInColProvider,
  usePrepareCreateEventInCol,
} from "../event-in-col/prepare-create-event-provider";
import {
  ResizeEventInColProvider,
  useResizeEventInCol,
} from "../event-in-col/resize-event-provider";
import { CreateEventFormDialog } from "../event/create-event-form-dialog";
import { Event } from "../../_mocks/event-store";
import { eachHourOfInterval, endOfDay, format, startOfDay } from "date-fns";
import {
  DATE_EVENT_MIN_HEIGHT,
  DATE_EVENT_MIN_MINUTES,
} from "../event-in-col/utils";
import { DateColumn } from "./date-column";

type DailyCalendarImplProps = DailyCalendarProps & {
  scrollableRef: RefObject<HTMLDivElement>;
};

const DailyCalendarImpl: React.FC<DailyCalendarImplProps> = ({
  scrollableRef,
  date,
  events,
}) => {
  const { prepareCreateEventState, prepareCreateEventActions } =
    usePrepareCreateEventInCol();
  const { isEventMoving, moveEventActions } = useMoveEventInCol();
  const { isEventResizing, resizeEventActions } = useResizeEventInCol();

  const handleScroll = (e: React.UIEvent) => {
    const scrollTop = e.currentTarget.scrollTop;

    if (prepareCreateEventState) {
      prepareCreateEventActions.scroll(scrollTop);
    }

    if (isEventMoving) {
      moveEventActions.scroll(scrollTop);
    }

    if (isEventResizing) {
      resizeEventActions.scroll(scrollTop);
    }
  };

  return (
    <>
      <div className="flex min-h-0 flex-col">
        <div
          ref={scrollableRef}
          className="overflow-auto"
          style={{ scrollbarWidth: "none" }}
          onScroll={handleScroll}
        >
          <div className="relative grid grid-cols-[75px_1fr]">
            <div>
              {eachHourOfInterval({
                start: startOfDay(date),
                end: endOfDay(date),
              }).map((h, i) => {
                return (
                  <div
                    className="relative select-none whitespace-nowrap border-r border-neutral-200 pr-3 text-end tabular-nums text-neutral-400"
                    key={i}
                    style={{
                      height:
                        DATE_EVENT_MIN_HEIGHT * (60 / DATE_EVENT_MIN_MINUTES),
                      top: i !== 0 ? "-5px" : undefined,
                      fontSize: "10px",
                    }}
                  >
                    {format(h, "hh:mm a")}
                  </div>
                );
              })}
            </div>
            <DateColumn displayedDay={date} events={events} />
          </div>
        </div>
      </div>
      <CreateEventFormDialog
        isOpen={prepareCreateEventState.defaultCreateEventValues !== undefined}
        onClose={prepareCreateEventActions.clearState}
        defaultFormValues={prepareCreateEventState.defaultCreateEventValues}
        onChangeEventPeriodPreview={prepareCreateEventActions.setDragDateRange}
      />
    </>
  );
};

type DailyCalendarProps = { date: Date; events: Event[] };

export const DailyCalendar: React.FC<DailyCalendarProps> = (props) => {
  const scrollableRef = useRef<HTMLDivElement>(null);

  return (
    <PrepareCreateEventInColProvider scrollableRef={scrollableRef}>
      <MoveEventInColProvider scrollableRef={scrollableRef}>
        <ResizeEventInColProvider scrollableRef={scrollableRef}>
          <DailyCalendarImpl {...props} scrollableRef={scrollableRef} />
        </ResizeEventInColProvider>
      </MoveEventInColProvider>
    </PrepareCreateEventInColProvider>
  );
};
