import { LucideIcon, CheckIcon } from "lucide-react";
import { forwardRef } from "react";

type Props = { icon?: LucideIcon; title: string; isSelected: boolean };

export const ConfigMenuItem = forwardRef<HTMLButtonElement, Props>(
  function ConfigMenuItem({ icon: Icon, title, isSelected, ...props }, ref) {
    return (
      <button
        {...props}
        ref={ref}
        className="flex min-h-8 w-full items-center justify-between rounded-md px-2 transition-colors hover:bg-white/15 data-[selected=true]:bg-white/15"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className="text-neutral-400" />}
          <div className="text-sm">{title}</div>
        </div>
        {isSelected && <CheckIcon size={20} />}
      </button>
    );
  },
);
