import { LucideIcon } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";

type Props = { icon: LucideIcon } & ComponentPropsWithoutRef<"button">;

export const TaskDetailPanelButton: React.FC<Props> = ({
  icon: Icon,
  ...props
}) => {
  return (
    <button
      className="grid size-8 place-items-center rounded-md text-neutral-300 transition-colors hover:bg-white/15"
      {...props}
    >
      <Icon size={18} />
    </button>
  );
};
