"use client";
import { ComponentPropsWithoutRef, ReactNode, useState } from "react";
import { MonthlyCalendar } from "./monthly-calendar/monthly-calendar";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { addMonths, subMonths } from "date-fns";
import "./style.css";

const Page = () => {
  const [yearMonth, setYearMonth] = useState(new Date());

  const year = yearMonth.getFullYear();
  const month = yearMonth.getMonth() + 1;

  const handleGoPrevMonth = () => {
    setYearMonth(subMonths(yearMonth, 1));
  };
  const handleGoNextMonth = () => {
    setYearMonth(addMonths(yearMonth, 1));
  };

  return (
    <div className="grid h-[100dvh] w-[100dvw] grid-rows-[min-content,1fr] gap-4 overflow-hidden bg-neutral-100 p-4 text-neutral-700">
      <div className="flex items-center gap-2">
        <MonthNavigationButton onClick={handleGoPrevMonth}>
          <TbChevronLeft />
        </MonthNavigationButton>
        <div className="flex select-none items-center">
          <div className="mx-1 text-lg tabular-nums">{year}</div>年
          <div className="mx-1 w-6 text-center text-lg tabular-nums">
            {month}
          </div>
          月
        </div>
        <MonthNavigationButton onClick={handleGoNextMonth}>
          <TbChevronRight />
        </MonthNavigationButton>
      </div>
      <div className="">
        <MonthlyCalendar yearMonth={yearMonth} />
      </div>
    </div>
  );
};

const MonthNavigationButton: React.FC<
  { children: ReactNode } & ComponentPropsWithoutRef<"button">
> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="grid size-6 place-items-center rounded text-lg transition-colors hover:bg-neutral-500/20"
    >
      {children}
    </button>
  );
};

export default Page;
