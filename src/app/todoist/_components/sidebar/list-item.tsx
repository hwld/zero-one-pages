import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import { ReactNode, ComponentPropsWithoutRef, forwardRef } from "react";
import { IconType } from "react-icons/lib";

const mutedTextClass = "text-stone-500";
const activeTextClass = "text-rose-700";
const listItemClass = (active?: boolean) =>
  clsx(
    "flex h-9 w-full items-center justify-between gap-2 rounded px-2 transition-colors",
    active ? clsx("bg-rose-100", activeTextClass) : "hover:bg-black/5",
  );

type ContentProps = {
  icon: IconType;
  active?: boolean;
  right?: ReactNode;
  children: ReactNode;
};

export const SidebarListItemContent: React.FC<ContentProps> = ({
  icon: Icon,
  right,
  active,
  children,
}) => {
  return (
    <>
      <span className="flex min-w-0 items-center gap-1">
        <span className="grid size-7 place-items-center">
          <Icon
            className={clsx(
              "size-6 shrink-0",
              active ? activeTextClass : mutedTextClass,
            )}
          />
        </span>
        <div className="truncate">{children}</div>
      </span>
      <span className={clsx(active ? activeTextClass : mutedTextClass)}>
        {right}
      </span>
    </>
  );
};

type ListButtonProps = ContentProps & ComponentPropsWithoutRef<"button">;

export const SidebarListButton = forwardRef<HTMLButtonElement, ListButtonProps>(
  function SidebarListButton({ icon, active, right, children, ...props }, ref) {
    return (
      <li>
        <button ref={ref} {...props} className={listItemClass(active)}>
          <SidebarListItemContent icon={icon} active={active} right={right}>
            {children}
          </SidebarListItemContent>
        </button>
      </li>
    );
  },
);

type ListLinkProps = LinkProps & {
  icon: IconType;
  right?: ReactNode;
  children: ReactNode;
  activeIcon?: IconType;
  currentRoute: string;
};

export const SidebarListLink = forwardRef<HTMLAnchorElement, ListLinkProps>(
  function SidebarListLink(
    { icon, activeIcon, currentRoute, right, children, ...props },
    ref,
  ) {
    const active = currentRoute === props.href;
    const actualIcon = (active ? activeIcon : icon) ?? icon;

    return (
      <li>
        <Link ref={ref} {...props} className={listItemClass(active)}>
          <SidebarListItemContent
            icon={actualIcon}
            active={active}
            right={right}
          >
            {children}
          </SidebarListItemContent>
        </Link>
      </li>
    );
  },
);
