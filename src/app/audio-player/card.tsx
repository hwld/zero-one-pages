"use client";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const Card: React.FC<{
  children?: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 w-full flex-col rounded-lg border border-neutral-600 bg-neutral-800 p-4 shadow",
        className,
      )}
    >
      {children}
    </div>
  );
};
