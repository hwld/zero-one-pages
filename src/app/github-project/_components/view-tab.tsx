import clsx from "clsx";
import { KanbanSquareIcon, LucideIcon } from "lucide-react";
import { ComponentPropsWithoutRef, ReactNode, forwardRef } from "react";
import Link from "next/link";
import { ViewOptionMenuTrigger } from "./view-option-menu/trigger";

type ViewTabProps = {
  icon?: LucideIcon;
  children: ReactNode;
  interactive?: boolean;
  rightIcon?: ReactNode;
};
const ViewTabContent: React.FC<ViewTabProps> = ({
  icon: Icon = KanbanSquareIcon,
  children,
  interactive = true,
  rightIcon,
}) => {
  return (
    <div
      className={clsx(
        "flex w-full items-center gap-3 rounded-md border-[2px] border-transparent px-2 py-[6px] outline-1 transition-colors group-focus-visible:border-blue-300",
        interactive
          ? "text-neutral-400 group-hover:bg-white/10 group-hover:text-neutral-100"
          : "text-neutral-100",
      )}
    >
      <div className="flex items-center gap-2">
        <Icon size={16} />
        <div className="text-sm">{children}</div>
      </div>
      {rightIcon}
    </div>
  );
};

const viewTabClass = (active: boolean = false) =>
  clsx(
    "group relative -mb-[1px] flex min-w-[100px] items-start gap-1 border-x border-t px-1 focus-visible:outline-none",
    active
      ? "rounded-t-md border-neutral-600 bg-neutral-800 text-neutral-100"
      : "rounded-md border-transparent",
  );

type ViewTabButtonProps = ViewTabProps & { active?: boolean } & Omit<
    ComponentPropsWithoutRef<"button">,
    "className"
  >;

export const ViewTabButton = forwardRef<HTMLButtonElement, ViewTabButtonProps>(
  function ViewTabButton({ icon, children, ...props }, ref) {
    return (
      <button ref={ref} {...props} className={viewTabClass(false)}>
        <ViewTabContent icon={icon}>{children}</ViewTabContent>
      </button>
    );
  },
);

type ViewTabLinkProps = ViewTabProps & { href: string; active?: boolean };
export const ViewTabLink: React.FC<ViewTabLinkProps> = ({
  href,
  icon,
  active = false,
  children,
}) => {
  const Wrapper = active ? "div" : Link;
  return (
    <Wrapper href={href} className={viewTabClass(active)}>
      <ViewTabContent
        icon={icon}
        interactive={!active}
        rightIcon={active && <ViewOptionMenuTrigger />}
      >
        {children}
        {active && (
          <>
            <OuterBottomCorner position="right" />
            <OuterBottomCorner position="left" />
          </>
        )}
      </ViewTabContent>
    </Wrapper>
  );
};

const OuterBottomCorner: React.FC<{
  position: "left" | "right";
}> = ({ position }) => {
  const positionClass = {
    left: "right-full before:rounded-br-[8px] before:border-r",
    right: "left-full before:rounded-bl-[8px] before:border-l",
  };

  return (
    <div
      className={clsx(
        "absolute bottom-0 size-2 bg-neutral-800 before:absolute before:left-0 before:top-0 before:size-2  before:border-b before:border-neutral-600 before:bg-neutral-900 before:content-['']",
        positionClass[position],
      )}
    />
  );
};
