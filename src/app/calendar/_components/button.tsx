import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import { TbLoader2 } from "react-icons/tb";

type Variant = "default" | "ghost";

type Props = {
  variant?: Variant;
  isPending?: boolean;
} & ComponentPropsWithoutRef<"button">;

const buttonClass = {
  default: "bg-neutral-700 text-neutral-100 hover:bg-neutral-800",
  ghost: " bg-transparent text-neutral-700 hover:bg-black/10",
} satisfies Record<Variant, string>;

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "default", isPending = false, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        "relative flex h-8 select-none items-center rounded px-3 text-sm transition-colors",
        buttonClass[variant],
        isPending && "pointer-events-none",
      )}
    >
      <div className={isPending ? "opacity-0" : ""}>{children}</div>
      {isPending && (
        <div className="absolute left-1/2 top-1/2 block size-5 -translate-x-1/2 -translate-y-1/2">
          <TbLoader2 className="size-full animate-spin text-neutral-400" />
        </div>
      )}
    </button>
  );
});
