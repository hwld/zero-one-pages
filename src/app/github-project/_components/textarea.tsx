import { ComponentPropsWithoutRef, forwardRef } from "react";

type Props = Omit<ComponentPropsWithoutRef<"textarea">, "className">;

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  function Textarea({ ...props }, ref) {
    return (
      <textarea
        ref={ref}
        rows={10}
        {...props}
        className="w-full rounded-md border border-neutral-600 p-2 text-sm text-neutral-100 aria-[invalid=true]:border-red-400 aria-[invalid=true]:outline-red-400"
      />
    );
  },
);
