import { IconType } from "@react-icons/all-files/lib/iconBase";
import { ComponentPropsWithoutRef, forwardRef } from "react";

type Props = {
  icon: IconType;
} & ComponentPropsWithoutRef<"button">;

export const SidebarIconButton = forwardRef<HTMLButtonElement, Props>(
  function SidebarIconButton({ icon: Icon, ...props }, ref) {
    return (
      <button
        ref={ref}
        {...props}
        className="grid size-8 place-items-center rounded text-stone-600 transition-colors hover:bg-black/5 hover:text-stone-900"
      >
        <Icon className="size-5" />
      </button>
    );
  },
);
