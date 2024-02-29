import clsx from "clsx";
import { LucideIcon } from "lucide-react";

export const ServerItem: React.FC<{ icon: LucideIcon; active?: boolean }> = ({
  icon: Icon,
  active,
}) => {
  return (
    <button
      className={clsx(
        "grid size-[45px] place-items-center rounded-full bg-neutral-300 text-neutral-900 transition-colors hover:bg-neutral-400",
        active && "ring-2 ring-green-500 ring-offset-2 ring-offset-neutral-800",
      )}
    >
      <Icon />
    </button>
  );
};
