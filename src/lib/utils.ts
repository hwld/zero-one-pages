import clsx, { ClassValue } from "clsx";
import type { SyntheticEvent } from "react";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const stopPropagation = (e: SyntheticEvent) => e.stopPropagation();
