import { useEffect, useMemo, useRef, useState } from "react";
import { MONTHLY_EVENT_ROW_SIZE, WEEK_DAY_LABELS } from "../../consts";
import { getCalendarDates } from "../../utils";
import { Event } from "../../_mocks/event-store";
import { MONTHLY_DATE_HEADER_HEIGHT } from "./calendar-date";
import { MoveWeekEventProvider } from "../week-event/move-event-provider";
import { CreateEventFormDialog } from "../event/create-event-form-dialog";
import {
  PrepareCreateWeekEventProvider,
  usePrepareCreateWeekEvent,
} from "../week-event/prepare-create-event-provider";
import { WeekRow } from "./week-row";
import { ResizeWeekEventProvider } from "../week-event/resize-event-provider";

type Props = {
  yearMonth: Date;
  events: Event[];
};

export const MonthlyCalendarImpl: React.FC<Props> = ({ yearMonth, events }) => {
  const year = useMemo(() => {
    return yearMonth.getFullYear();
  }, [yearMonth]);

  const month = useMemo(() => {
    return yearMonth.getMonth() + 1;
  }, [yearMonth]);

  const calendar = useMemo(() => {
    return getCalendarDates({ year, month });
  }, [month, year]);

  const firstWeekEventRowRef = useRef<HTMLDivElement>(null);
  const [eventLimit, setEventLimit] = useState(0);

  useEffect(() => {
    const eventSpace = firstWeekEventRowRef.current;
    const measure = () => {
      if (!eventSpace) {
        return;
      }
      const eventSpaceHeight =
        eventSpace.getBoundingClientRect().height - MONTHLY_DATE_HEADER_HEIGHT;
      // read moreを表示するため、-1する
      const eventLimit =
        Math.floor(eventSpaceHeight / MONTHLY_EVENT_ROW_SIZE) - 1;
      setEventLimit(eventLimit);
    };

    measure();

    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("reset", measure);
    };
  }, [yearMonth]);

  const { prepareCreateEventState, prepareCreateEventActions } =
    usePrepareCreateWeekEvent();

  return (
    <>
      <div className="grid h-full w-full grid-rows-[min-content,1fr] gap-2">
        <div className="grid w-full grid-cols-7">
          {WEEK_DAY_LABELS.map((weekDay) => {
            return (
              <div className="text-center text-xs" key={weekDay}>
                {weekDay}
              </div>
            );
          })}
        </div>
        <div className="grid">
          {calendar.map((week, i) => {
            return (
              <WeekRow
                key={`${week[i]}`}
                rowRef={i === 0 ? firstWeekEventRowRef : undefined}
                week={week}
                events={events}
                calendarYearMonth={yearMonth}
                eventLimit={eventLimit}
              />
            );
          })}
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

export const MonthlyCalendar: React.FC<Props> = (props) => {
  return (
    <PrepareCreateWeekEventProvider>
      <MoveWeekEventProvider>
        <ResizeWeekEventProvider>
          <MonthlyCalendarImpl {...props} />
        </ResizeWeekEventProvider>
      </MoveWeekEventProvider>
    </PrepareCreateWeekEventProvider>
  );
};
