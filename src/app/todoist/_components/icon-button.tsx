import { IconType } from "@react-icons/all-files";
import clsx from "clsx";
import { ComponentPropsWithoutRef, forwardRef } from "react";

type Props = {
  icon: IconType;
  size?: "md";
} & ComponentPropsWithoutRef<"button">;

export const IconButton = forwardRef<HTMLButtonElement, Props>(
  function IconButton({ icon: Icon, size = "md", ...props }, ref) {
    const sizeClass = {
      md: { button: "size-8", icon: "size-6" },
    };

    return (
      <button
        ref={ref}
        {...props}
        className={clsx(
          "grid place-items-center rounded ring-stone-500 transition-all hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2",
          sizeClass[size].button,
        )}
      >
        <Icon className={clsx(sizeClass[size].icon)} />
      </button>
    );
  },
);
