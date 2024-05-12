import clsx from "clsx";
import { WEEKLY_CALENDAR_GRID_COLS_CLASS } from "./weekly-calendar";
import { WEEK_DAY_LABELS } from "../../consts";
import { LongTermEventCell } from "./long-term-event-cell";
import { Event } from "../../_mocks/event-store";
import { useState } from "react";
import { isSameDay } from "date-fns";
import { LongTermEventRow } from "./long-term-event-row";
import { getWeekEvents } from "../monthly-calendar/utils";
import { TbArrowsDiagonal2, TbArrowsDiagonalMinimize } from "react-icons/tb";
import { CreateEventFormDialog } from "../create-event-form-dialog";
import { usePrepareCreateEvent } from "../monthly-calendar/prepare-create-event-provider";
import { useMoveEvent } from "../monthly-calendar/move-event-provider";

export const DAY_TITLE_HEIGHT = 28;

type Props = {
  currentDate: Date;
  week: Date[];
  longTermEvents: Event[];
};

export const WeeklyCalendarDayHeader: React.FC<Props> = ({
  currentDate,
  week,
  longTermEvents,
}) => {
  const [expanded, setExpanded] = useState(false);
  const weekLongTermEvents = getWeekEvents({ week, events: longTermEvents });

  const { prepareCreateEventState, prepareCreateEventActions } =
    usePrepareCreateEvent();
  const { moveEventPreview, moveEventActions } = useMoveEvent();

  return (
    <>
      <div
        className={clsx(
          "sticky top-0 z-40 grid bg-neutral-100",
          WEEKLY_CALENDAR_GRID_COLS_CLASS,
        )}
      >
        <div className="flex select-none flex-col">
          <div style={{ height: DAY_TITLE_HEIGHT }} />
          <div className="flex grow items-start justify-center border-y border-r border-neutral-300 py-1 text-xs text-neutral-400">
            <div className="flex items-center gap-1">
              長期
              <button
                className="grid size-6 place-items-center rounded text-[14px] text-neutral-500 transition-colors hover:bg-neutral-500/15"
                onClick={() => {
                  setExpanded(!expanded);
                }}
              >
                {expanded ? (
                  <TbArrowsDiagonalMinimize className="rotate-45" />
                ) : (
                  <TbArrowsDiagonal2 className="rotate-45" />
                )}
              </button>
            </div>
          </div>
        </div>
        {week.map((date) => {
          return (
            <div className="flex flex-col" key={`${date}`}>
              <div
                className="flex select-none items-center justify-center gap-1 pb-1 text-xs"
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
          moveEventPreview={moveEventPreview}
          moveEventActions={moveEventActions}
          prepareCreateEventState={prepareCreateEventState}
          prepareCreateEventActions={prepareCreateEventActions}
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
