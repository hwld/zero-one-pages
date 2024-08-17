import clsx from "clsx";
import { ComponentPropsWithoutRef, forwardRef } from "react";

type Props = ComponentPropsWithoutRef<"input">;

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      {...props}
      className={clsx(
        "flex h-8 w-full items-center rounded border border-stone-300 bg-transparent px-2 transition-colors focus:border-stone-700 focus:outline-none aria-[invalid=true]:border-red-400",
      )}
    />
  );
});
