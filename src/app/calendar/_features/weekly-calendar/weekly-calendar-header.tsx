import clsx from "clsx";
import { WEEKLY_CALENDAR_GRID_TEMPLATE_COLUMNS } from "./weekly-calendar";
import { WEEK_DAY_LABELS } from "../../consts";
import {
  CELL_Y_MARGIN,
  LONG_TERM_EVENT_DISPLAY_LIMIT,
  LongTermEventCell,
} from "./long-term-event-cell";
import { Event } from "../../_mocks/event-store";
import { useState } from "react";
import { isSameDay, isSameMonth } from "date-fns";
import { CreateEventFormDialog } from "../event/create-event-form-dialog";
import { usePrepareCreateWeekEvent } from "../week-event/prepare-create-event-provider";
import { IconButton } from "../../_components/button";
import { CollapseIcon, ExpandIcon } from "../../_components/expand-icon";
import { WeekEventRow } from "../week-event/week-event-row";
import { DATE_EVENT_MIN_HEIGHT } from "../date-event/utils";
import { useOptimisticWeekEvents } from "../week-event/use-optimistic-week-events";
import { useMinuteClock } from "../../_components/use-minute-clock";

export const DAY_TITLE_HEIGHT = 28;

type Props = {
  calendarYearMonth: Date;
  week: Date[];
  longTermEvents: Event[];
};

export const WeeklyCalendarDayHeader: React.FC<Props> = ({
  calendarYearMonth,
  week,
  longTermEvents,
}) => {
  const { currentDate } = useMinuteClock();
  const [expanded, setExpanded] = useState(false);
  const weekLongTermEvents = useOptimisticWeekEvents({
    displayDateRange: { start: week.at(0)!, end: week.at(-1)! },
    events: longTermEvents,
  });

  const { prepareCreateEventState, prepareCreateEventActions } =
    usePrepareCreateWeekEvent();

  return (
    <>
      <div
        className={clsx("relative grid")}
        style={{ gridTemplateColumns: WEEKLY_CALENDAR_GRID_TEMPLATE_COLUMNS }}
      >
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
        <div
          className="absolute inset-0 col-start-2"
          style={{ top: DAY_TITLE_HEIGHT + CELL_Y_MARGIN }}
        >
          <WeekEventRow
            week={week}
            allWeekEvents={weekLongTermEvents}
            eventHeight={DATE_EVENT_MIN_HEIGHT}
            eventLimit={expanded ? undefined : LONG_TERM_EVENT_DISPLAY_LIMIT}
            onClickMoreWeekEvents={() => setExpanded(true)}
          />
        </div>
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
