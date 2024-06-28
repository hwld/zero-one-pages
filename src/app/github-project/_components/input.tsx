import { ComponentPropsWithoutRef, forwardRef } from "react";

type Props = {} & Omit<ComponentPropsWithoutRef<"input">, "className">;

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      {...props}
      className="h-8 w-full rounded-md border border-neutral-600 bg-transparent px-2 text-sm text-neutral-100 aria-[invalid=true]:border-red-400 aria-[invalid=true]:outline-red-400"
    />
  );
});
