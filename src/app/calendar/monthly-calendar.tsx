import clsx from "clsx";
import { useRef, useState } from "react";

type DragRange = { start: number | undefined; end: number | undefined };

const inDragRange = (value: number, range: DragRange) => {
  if (range.start === undefined && range.end === undefined) {
    return false;
  }

  if (range.start === undefined) {
    return value === range.end;
  }

  if (range.end === undefined) {
    return value === range.start;
  }

  const min = Math.min(range.start, range.end);
  const max = Math.max(range.start, range.end);
  return value >= min && value <= max;
};

export const MonthlyCalendar: React.FC = () => {
  const days = new Date(2024, 4, 0).getDate();
  const weeks = Math.ceil(days / 7);

  const [dragState, setDragState] = useState<DragRange>({
    start: undefined,
    end: undefined,
  });

  const isDragging = useRef(false);
  return (
    <div className="[&>div:last-child]:border-b">
      {[...new Array(weeks)].map((_, i) => {
        return (
          <div
            key={i}
            className="grid auto-rows-[170px] grid-cols-7 [&>div:last-child]:border-r"
          >
            {[...new Array(7)].map((_, j) => {
              const day = i * 7 + 1 + j;

              return (
                <div
                  key={day}
                  className={clsx(
                    "select-none border-l border-t text-xs text-neutral-700",
                    inDragRange(day, dragState) ? "bg-blue-500/20" : "",
                  )}
                  onMouseOver={(e) => {
                    if (isDragging.current) {
                      setDragState((s) => ({ ...s, end: day }));
                    }
                    console.log(e.buttons);
                  }}
                  onMouseDown={() => {
                    setDragState({ start: day, end: undefined });
                    isDragging.current = true;
                  }}
                  onMouseUp={() => {
                    isDragging.current = false;
                  }}
                >
                  <div className="p-2">{day > days ? "" : day}</div>
                  <div></div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// 1 ~ 7
// 8 ~ 14
