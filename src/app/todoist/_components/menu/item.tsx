import { useListItem, useFloatingTree, useMergeRefs } from "@floating-ui/react";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  ReactNode,
  useContext,
} from "react";
import { IconType } from "@react-icons/all-files/lib/iconBase";
import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { MenuContext } from "./menu";
import { PiCaretRightBold } from "@react-icons/all-files/pi/PiCaretRightBold";
import { cn } from "@/lib/utils";

type ContentProps = {
  icon: IconType;
  label: string;
  description?: string;
  right?: ReactNode;
};

const MenuItemContent: React.FC<ContentProps> = ({
  icon: Icon,
  label,
  description,
  right,
}) => {
  return (
    <div
      className={clsx(
        "flex min-h-8 items-center justify-between gap-2 px-2",
        description && "py-2",
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className={clsx("size-5", description && "self-start")} />
        <div className="flex flex-col items-start gap-1">
          <div className={clsx(description && "font-bold")}>{label}</div>
          {description ? (
            <div className="text-xs text-stone-500">{description}</div>
          ) : null}
        </div>
      </div>
      <div className="flex items-center text-xs text-stone-500">{right}</div>
    </div>
  );
};

const itemClass = "mx-2 rounded focus:bg-black/5 focus:outline-none";

type MenuItemWrapperProps = {
  children: ReactNode;
};

export const MenuItemWrapper = forwardRef<
  HTMLButtonElement,
  MenuItemWrapperProps
>(function MenuItem({ children }, forwardedRef) {
  const menu = useContext(MenuContext);
  const item = useListItem();
  const tree = useFloatingTree();
  const isActive = item.index === menu.activeIndex;

  return (
    <Slot
      ref={useMergeRefs([item.ref, forwardedRef])}
      role="menuitem"
      className={itemClass}
      tabIndex={isActive ? 0 : -1}
      {...menu.getItemProps({
        onClick() {
          tree?.events.emit("click");
        },
        onFocus() {
          menu.setHasFocusInside(true);
        },
      })}
    >
      {children}
    </Slot>
  );
});

type ButtonItemProps = ContentProps & ComponentPropsWithoutRef<"button">;

export const MenuButtonItem: React.FC<ButtonItemProps> = ({
  icon,
  label,
  description,
  right,
  ...props
}) => {
  return (
    <MenuItemWrapper>
      <button {...props}>
        <MenuItemContent
          icon={icon}
          label={label}
          description={description}
          right={right}
        />
      </button>
    </MenuItemWrapper>
  );
};

type LinkItemProps = ContentProps & LinkProps;

export const MenuLinkItem: React.FC<LinkItemProps> = ({
  icon,
  label,
  description,
  right,
  ...props
}) => {
  return (
    <MenuItemWrapper>
      <Link {...props}>
        <MenuItemContent
          icon={icon}
          label={label}
          description={description}
          right={right}
        />
      </Link>
    </MenuItemWrapper>
  );
};

type SubMenuTrigger = Omit<ContentProps, "right"> &
  ComponentPropsWithoutRef<"button">;

export const SubMenuTrigger = forwardRef<HTMLButtonElement, SubMenuTrigger>(
  function SubMenuTrigger(
    { icon, label, description, className, ...props },
    ref,
  ) {
    return (
      <button ref={ref} {...props} className={cn(className, itemClass)}>
        <MenuItemContent
          icon={icon}
          label={label}
          description={description}
          right={<PiCaretRightBold />}
        />
      </button>
    );
  },
);
