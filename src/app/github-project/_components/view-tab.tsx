import clsx from "clsx";
import { KanbanSquareIcon, LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { ViewOptionMenuTrigger } from "./view-option-menu/trigger";

type Props = {
  active?: boolean;
  children: ReactNode;
  icon?: LucideIcon;
};

export const ViewTab: React.FC<Props> = ({
  children,
  icon: Icon = KanbanSquareIcon,
  active = false,
}) => {
  const Wrapper = active ? "div" : "button";

  return (
    <Wrapper
      className={clsx(
        "-mb-[1px] flex items-center gap-2 border-neutral-600 px-4 py-2",
        active
          ? "rounded-t-md border-x border-t bg-neutral-800 text-neutral-100"
          : "rounded-md text-neutral-400 transition-colors hover:bg-white/10 hover:text-neutral-100",
      )}
    >
      <Icon size={20} />
      <div className="text-sm">{children}</div>
      {active && <ViewOptionMenuTrigger />}
    </Wrapper>
  );
};
