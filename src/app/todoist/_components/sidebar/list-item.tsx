import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import { ComponentPropsWithoutRef, ReactNode, forwardRef } from "react";
import { IconType } from "@react-icons/all-files/lib";

const mutedTextClass = "text-stone-500";
const activeTextClass = "text-rose-700";

type WrapperProps = {
  active?: boolean;
  right?: ReactNode;
  children: ReactNode;
};

export const ItemWrapper: React.FC<WrapperProps> = ({
  right,
  active,
  children,
}) => {
  return (
    <div
      className={clsx(
        "flex h-9 w-full items-center justify-between rounded px-2 transition-colors",
        active ? clsx("bg-rose-100", activeTextClass) : "hover:bg-black/5",
      )}
    >
      {children}
      {right && (
        <span
          className={clsx("pl-1", active ? activeTextClass : mutedTextClass)}
        >
          {right}
        </span>
      )}
    </div>
  );
};

type ContentProps = {
  icon: IconType;
  active?: boolean;
  children: ReactNode;
};

export const ItemContent: React.FC<ContentProps> = ({
  icon: Icon,
  active,
  children,
}) => {
  return (
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
  );
};

type ListButtonProps = {
  icon: IconType;
  right?: ReactNode;
  onClick?: () => void;
  children: ReactNode;
};

export const SidebarListButton = forwardRef<HTMLLIElement, ListButtonProps>(
  function SidebarListButton({ icon, right, children, ...props }, ref) {
    return (
      <li ref={ref}>
        <ItemWrapper right={right}>
          <button {...props} className="w-full">
            <ItemContent icon={icon}>{children}</ItemContent>
          </button>
        </ItemWrapper>
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
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
} & Omit<ComponentPropsWithoutRef<"a">, "onPointerEnter" | "onPointerLeave">;

export const SidebarListLink = forwardRef<HTMLLIElement, ListLinkProps>(
  function SidebarListLink(
    {
      icon,
      activeIcon,
      currentRoute,
      right,
      children,
      onPointerEnter,
      onPointerLeave,
      ...props
    },
    ref,
  ) {
    const active = currentRoute === props.href;
    const actualIcon = (active ? activeIcon : icon) ?? icon;

    return (
      <li
        ref={ref}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <ItemWrapper active={active} right={right}>
          <Link {...props} className="w-full">
            <ItemContent icon={actualIcon} active={active}>
              {children}
            </ItemContent>
          </Link>
        </ItemWrapper>
      </li>
    );
  },
);
