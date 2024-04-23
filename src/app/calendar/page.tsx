"use client";
import { MonthlyCalendar } from "./monthly-calendar/monthly-calendar";

const Page = () => {
  return (
    <div className="grid min-h-[100dvh] min-w-[100dvw] place-items-center bg-neutral-100">
      <div className="h-[90%] w-[90%]">
        <MonthlyCalendar />
      </div>
    </div>
  );
};

export default Page;
