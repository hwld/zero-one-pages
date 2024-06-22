import { clsx } from "clsx";
import { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  label: string;
  red?: boolean;
};

export const TaskDetailPanelListButton: React.FC<Props> = ({
  red,
  icon: Icon,
  label,
}) => {
  return (
    <button
      className={clsx(
        "flex h-8 w-full items-center justify-between gap-2 rounded-md px-2 transition-colors",
        red
          ? "text-red-500 hover:bg-red-500/15"
          : "text-neutral-100 hover:bg-white/15",
      )}
    >
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon
            size={16}
            className={red ? "text-red-500" : "text-neutral-400"}
          />
        )}
        <span className="text-sm">{label}</span>
      </div>
    </button>
  );
};
