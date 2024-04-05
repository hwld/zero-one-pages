import clsx from "clsx";
import { ComponentPropsWithoutRef, ReactNode } from "react";

type Props = {
  color?: "primary" | "default" | "destructive";
  children: ReactNode;
  size?: "md" | "lg";
} & ComponentPropsWithoutRef<"button">;

export const Button: React.FC<Props> = ({
  color = "default",
  children,
  size = "md",
  ...props
}) => {
  const colorClass = {
    default:
      "bg-neutral-800 border border-neutral-600 text-neutral-200 enabled:hover:bg-neutral-700",
    primary:
      "bg-green-700 border border-green-600 enabled:hover:bg-green-600 text-neutral-100",
    destructive:
      "bg-neutral-800 text-red-500 enabled:hover:bg-red-500 enabled:hover:text-neutral-100 border border-neutral-600 enabled:hover:border-red-500",
  } satisfies Record<NonNullable<Props["color"]>, string>;

  const sizeClass = {
    md: "h-7 text-xs px-2",
    lg: "h-8 text-sm px-3",
  } satisfies Record<NonNullable<Props["size"]>, string>;

  return (
    <button
      {...props}
      className={clsx(
        "rounded-md transition-colors disabled:opacity-50",
        colorClass[color],
        sizeClass[size],
      )}
    >
      {children}
    </button>
  );
};
