import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import { ComponentPropsWithoutRef, ReactNode, forwardRef } from "react";
import { IconType } from "@react-icons/all-files/lib";

const mutedTextClass = "text-stone-500";
const activeTextClass = "text-rose-700";
const wrapperChildClass = "flex h-full w-full items-center pl-[--padding-x]";

type WrapperProps = {
  active?: boolean;
  right?: ReactNode;
  children: ReactNode;
} & ComponentPropsWithoutRef<"div">;

// buttonやa要素の中にbuttonやa要素を含めることができないので、一つ上にWrapperを作って、兄弟としてレンダリングする
export const ItemWrapper: React.FC<WrapperProps> = ({
  right,
  active,
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      className={clsx(
        "flex h-9 w-full items-center justify-between rounded transition-colors",
        active ? clsx("bg-rose-100", activeTextClass) : "hover:bg-black/5",
      )}
      style={{ ["--padding-x" as string]: "8px" }}
    >
      {children}
      {right && (
        <span
          className={clsx(
            "pl-1 pr-[--padding-x]",
            active ? activeTextClass : mutedTextClass,
          )}
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
          <button {...props} className={wrapperChildClass}>
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
  subList?: ReactNode;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
} & Omit<ComponentPropsWithoutRef<"a">, "onPointerEnter" | "onPointerLeave">;

export const SidebarListLink = forwardRef<HTMLLIElement, ListLinkProps>(
  function SidebarListLink(
    {
      icon,
      activeIcon,
      currentRoute,
      right,
      subList,
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
      <li ref={ref}>
        <ItemWrapper
          active={active}
          right={right}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
        >
          <Link {...props} className={wrapperChildClass}>
            <ItemContent icon={actualIcon} active={active}>
              {children}
            </ItemContent>
          </Link>
        </ItemWrapper>
        {subList}
      </li>
    );
  },
);
