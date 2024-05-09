import clsx from "clsx";
import { WEEKLY_CALENDAR_GRID_COLS_CLASS } from "./weekly-calendar";
import { WEEK_DAY_LABELS } from "../consts";
import { LongTermEventCell } from "./long-term-event-cell";
import { Event } from "../mocks/event-store";
import { useEffect, useState } from "react";
import {
  DragDateRange,
  DraggingEvent,
  getEventFromDraggingEvent,
} from "../utils";
import { isSameDay, max, min } from "date-fns";
import { LongTermEventRow } from "./long-term-event-row";
import { getWeekEvents } from "../monthly-calendar/utils";
import { TbArrowsDiagonal2, TbArrowsDiagonalMinimize } from "react-icons/tb";
import { useCreateEvent } from "../queries/use-create-event";
import { useUpdateEvent } from "../queries/use-update-event";
import { CreateEventFormDialog } from "../create-event-form-dialog";
import { CreateEventInput } from "../mocks/api";

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
  const createEventMutation = useCreateEvent();
  const updateEventMutatin = useUpdateEvent();

  const [expanded, setExpanded] = useState(false);

  const weekLongTermEvents = getWeekEvents({ week, events: longTermEvents });

  // TODO: rename
  const [dragDateRange, setDragDateRange] = useState<DragDateRange | undefined>(
    undefined,
  );

  // TODO: rename
  const [eventFormState, setEventFormState] =
    useState<Omit<CreateEventInput, "title">>();

  const handleCloseFormDialog = () => {
    setEventFormState(undefined);
    setDragDateRange(undefined);
  };

  useEffect(() => {
    const createAllDayEvent = (e: MouseEvent) => {
      if (!dragDateRange || e.button !== 0) {
        return;
      }

      const { dragStartDate, dragEndDate } = dragDateRange;

      const start = min([dragStartDate, dragEndDate]);
      const end = max([dragStartDate, dragEndDate]);

      setEventFormState({ allDay: true, start, end });
    };

    document.addEventListener("mouseup", createAllDayEvent);
    return () => {
      document.removeEventListener("mouseup", createAllDayEvent);
    };
  }, [createEventMutation, dragDateRange]);

  const [draggingLongTermEvent, setDraggingLongTermEvent] = useState<
    DraggingEvent | undefined
  >(undefined);

  useEffect(() => {
    const moveLongTermEvent = (e: MouseEvent) => {
      if (!draggingLongTermEvent || e.button !== 0) {
        return;
      }

      const newEvent = getEventFromDraggingEvent(draggingLongTermEvent);
      updateEventMutatin.mutate(newEvent);

      setDraggingLongTermEvent(undefined);
    };

    document.addEventListener("mouseup", moveLongTermEvent);
    return () => {
      document.removeEventListener("mouseup", moveLongTermEvent);
    };
  }, [draggingLongTermEvent, updateEventMutatin]);

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
                dragDateRange={dragDateRange}
                expanded={expanded}
              />
            </div>
          );
        })}
        <LongTermEventRow
          week={week}
          weekLongTermEvents={weekLongTermEvents}
          isDraggingDate={!!dragDateRange}
          expanded={expanded}
          onChangeExpand={setExpanded}
          draggingEvent={draggingLongTermEvent}
          onChangeDraggingEvent={setDraggingLongTermEvent}
          dragDateRange={dragDateRange}
          onChangeDragDateRange={setDragDateRange}
        />
      </div>
      <CreateEventFormDialog
        defaultFormValues={eventFormState}
        onChangeEventPeriodPreview={setDragDateRange}
        onClose={handleCloseFormDialog}
      />
    </>
  );
};
