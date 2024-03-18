import clsx from "clsx";
import { ComponentPropsWithoutRef, ReactNode, forwardRef } from "react";

type Props = {
  children: ReactNode;
  variant?: "default" | "ghost";
} & ComponentPropsWithoutRef<"button">;
export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "default", children, className, ...props },
  ref,
) {
  const buttonClass = {
    default: "border border-zinc-600 bg-zinc-700 hover:bg-zinc-600 ",
    ghost: "hover:bg-white/10",
  };

  return (
    <button
      ref={ref}
      className={clsx(
        "flex h-7 items-center gap-1 rounded px-2 text-xs transition-colors",
        buttonClass[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
