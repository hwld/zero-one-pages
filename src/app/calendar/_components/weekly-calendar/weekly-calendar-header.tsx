import clsx from "clsx";
import { WEEKLY_CALENDAR_GRID_COLS_CLASS } from "./weekly-calendar";
import { WEEK_DAY_LABELS } from "../../consts";
import { LongTermEventCell } from "./long-term-event-cell";
import { Event } from "../../_mocks/event-store";
import { useState } from "react";
import { isSameDay, isSameMonth } from "date-fns";
import { LongTermEventRow } from "./long-term-event-row";
import { getWeekEvents } from "../monthly-calendar/utils";
import { CreateEventFormDialog } from "../create-event-form-dialog";
import { usePrepareCreateEvent } from "../monthly-calendar/prepare-create-event-provider";
import { useMoveEvent } from "../monthly-calendar/move-event-provider";
import { getEventFromDraggingEvent } from "../utils";
import { IconButton } from "../button";
import { CollapseIcon, ExpandIcon } from "./expand-icon";

export const DAY_TITLE_HEIGHT = 28;

type Props = {
  currentDate: Date;
  calendarYearMonth: Date;
  week: Date[];
  longTermEvents: Event[];
};

export const WeeklyCalendarDayHeader: React.FC<Props> = ({
  currentDate,
  calendarYearMonth,
  week,
  longTermEvents,
}) => {
  const { isEventMoving, moveEventPreview } = useMoveEvent();

  const [expanded, setExpanded] = useState(false);
  const weekLongTermEvents = getWeekEvents({
    week,
    events: longTermEvents.map((event) => {
      if (!isEventMoving && moveEventPreview?.event.id === event.id) {
        return getEventFromDraggingEvent(moveEventPreview);
      }

      return event;
    }),
  });

  const { prepareCreateEventState, prepareCreateEventActions } =
    usePrepareCreateEvent();

  return (
    <>
      <div className={clsx("relative grid", WEEKLY_CALENDAR_GRID_COLS_CLASS)}>
        <div className="flex select-none flex-col">
          <div style={{ height: DAY_TITLE_HEIGHT }} />
          <div
            className="flex grow items-start justify-end border-y border-r border-neutral-200 py-1 pr-1 text-xs text-neutral-400"
            style={{ fontSize: "10px" }}
          >
            <div className="flex items-center gap-1">
              長期
              <IconButton
                size="sm"
                variant="muted"
                icon={expanded ? CollapseIcon : ExpandIcon}
                onClick={() => setExpanded((s) => !s)}
              />
            </div>
          </div>
        </div>
        {week.map((date) => {
          return (
            <div className="flex flex-col" key={`${date}`}>
              <div
                className={clsx(
                  "flex select-none items-center justify-center gap-1 pb-1 text-xs",
                  isSameMonth(date, calendarYearMonth)
                    ? "opacity-100"
                    : "opacity-50",
                )}
                style={{ height: DAY_TITLE_HEIGHT }}
              >
                <div>{WEEK_DAY_LABELS[date.getDay()]}</div>
                <div
                  className={clsx(
                    "grid size-5 place-items-center rounded",
                    isSameDay(currentDate, date) &&
                      "bg-blue-500 text-neutral-100",
                  )}
                >
                  {date.getDate()}
                </div>
              </div>
              <LongTermEventCell
                date={date}
                events={weekLongTermEvents}
                dragDateRangeForCreate={prepareCreateEventState.dragDateRange}
                expanded={expanded}
              />
            </div>
          );
        })}
        <LongTermEventRow
          week={week}
          weekLongTermEvents={weekLongTermEvents}
          expanded={expanded}
          onChangeExpand={setExpanded}
        />
      </div>
      <CreateEventFormDialog
        isOpen={prepareCreateEventState.defaultCreateEventValues !== undefined}
        defaultFormValues={prepareCreateEventState.defaultCreateEventValues}
        onChangeEventPeriodPreview={prepareCreateEventActions.setDragDateRange}
        onClose={prepareCreateEventActions.clearState}
      />
    </>
  );
};
