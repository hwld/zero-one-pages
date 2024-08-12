import clsx from "clsx";
import { ComponentPropsWithoutRef } from "react";

type Props = { size?: "sm" | "md"; color?: "primary" | "secondary" } & Omit<
  ComponentPropsWithoutRef<"button">,
  "className"
>;

export const Button: React.FC<Props> = ({
  size = "md",
  color = "primary",
  ...props
}) => {
  const colorClass = {
    primary: "bg-rose-700 text-stone-100 hover:bg-rose-800",
    secondary: "bg-stone-200 text-stone-700 hover:bg-stone-300",
  };
  const sizeClass = {
    md: "h-8 px-3 text-sm font-medium",
    sm: "h-6 text-xs px-2",
  };

  return (
    <button
      className={clsx(
        "select-none rounded transition-all active:scale-95",
        sizeClass[size],
        colorClass[color],
      )}
      {...props}
    ></button>
  );
};
