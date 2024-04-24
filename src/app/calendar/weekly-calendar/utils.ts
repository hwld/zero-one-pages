import {
  addMinutes,
  startOfDay,
  Interval,
  differenceInMinutes,
} from "date-fns";

export const MINUTES_15_HEIGHT = 12;
/**
 * 年月日とweekly calendar上のy軸から日付を取得する
 */
export const getDateFromY = (yearMonthDate: Date, y: number): Date => {
  const date = addMinutes(
    startOfDay(yearMonthDate),
    Math.floor(y / MINUTES_15_HEIGHT) * 15,
  );
  return date;
};
/**
 *  日付に対応するweekly calendar上のtopを取得する
 */

export const getTopFromDate = (date: Date): number => {
  const top =
    Math.floor((date.getHours() * 60 + date.getMinutes()) / 15) *
    MINUTES_15_HEIGHT;

  return top;
};
/**
 * 日付の範囲対応するweekly calendar上のheightを取得する
 */

export const getHeightFromDate = ({ start, end }: Interval): number => {
  const height =
    Math.ceil(differenceInMinutes(end, start) / 15) * MINUTES_15_HEIGHT;

  return height;
};
