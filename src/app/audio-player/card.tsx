"use client";
import { ReactNode } from "react";

export const Card: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-full min-h-0 w-full flex-col rounded-lg border border-neutral-600 bg-neutral-800 p-4 shadow">
      {children}
    </div>
  );
};
