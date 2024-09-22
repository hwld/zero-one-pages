import clsx from "clsx";
import { ComponentPropsWithoutRef, forwardRef } from "react";

type Props = { size?: "sm" | "md"; color?: "primary" | "secondary" } & Omit<
  ComponentPropsWithoutRef<"button">,
  "className"
>;

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { size = "md", color = "primary", ...props },
  ref,
) {
  const colorClass = {
    primary:
      "bg-rose-700 text-stone-100 hover:bg-rose-800 focus-visible:outline-none ring-rose-400",
    secondary:
      "bg-stone-200 text-stone-700 hover:bg-stone-300 focus-visible:outline-none ring-stone-500",
  };
  const sizeClass = {
    md: "h-8 px-3 text-sm font-medium min-w-16",
    sm: "h-6 text-xs px-2",
  };

  return (
    <button
      ref={ref}
      className={clsx(
        "select-none rounded ring-offset-2 transition-all focus-visible:outline-none focus-visible:ring-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
        sizeClass[size],
        colorClass[color],
      )}
      {...props}
    ></button>
  );
});
