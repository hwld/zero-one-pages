import { useEffect, useState } from "react";

/**
 * 1分ごとに更新される日付を返す
 */
export const useMinuteClock = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const triggerMinuteUpdate = () => {
      window.setTimeout(
        () => {
          setCurrentDate(new Date());
          triggerMinuteUpdate();
        },
        (60 - new Date().getSeconds()) * 1000,
      );
    };

    triggerMinuteUpdate();
  }, []);

  return currentDate;
};
