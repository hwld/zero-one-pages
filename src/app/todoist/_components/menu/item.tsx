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
import { MenuContext, MenuItemClickEvent } from "./menu";
import { PiCaretRightBold } from "@react-icons/all-files/pi/PiCaretRightBold";
import { cn } from "../../../../lib/utils";

type ContentProps = {
  icon: IconType;
  label: ReactNode;
  description?: string;
  right?: ReactNode;
  variant?: "destructive" | "green" | "default";
};

const MenuItemContent: React.FC<ContentProps> = ({
  icon: Icon,
  label,
  description,
  right,
  variant = "default",
}) => {
  const variantClass = {
    destructive: "text-red-700",
    green: "bg-green-500/10 text-green-700",
    default: "",
  };

  return (
    <div
      className={clsx(
        "flex min-h-8 items-center justify-between gap-2 px-2",
        description && "py-2",
        variantClass[variant],
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Icon className={clsx("size-5", description && "self-start")} />
        <div className="flex min-w-0 flex-col items-start gap-1">
          <div
            className={clsx(
              "flex w-full items-start truncate text-nowrap",
              description && "font-bold",
            )}
          >
            {label}
          </div>
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
  closeMenuOnClick?: boolean;
};

const MenuItemWrapper = forwardRef<HTMLButtonElement, MenuItemWrapperProps>(
  function MenuItem({ children, closeMenuOnClick }, forwardedRef) {
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
            tree?.events.emit("click", {
              shouldCloseMenu: closeMenuOnClick ?? true,
            } satisfies MenuItemClickEvent);
          },
          onFocus() {
            menu.setHasFocusInside(true);
          },
        })}
      >
        {children}
      </Slot>
    );
  },
);

type ButtonItemProps = ContentProps &
  ComponentPropsWithoutRef<"button"> & { closeMenuOnClick?: boolean };

export const MenuButtonItem = forwardRef<HTMLButtonElement, ButtonItemProps>(
  function MenuButtonItem(
    { icon, label, description, right, variant, closeMenuOnClick, ...props },
    ref,
  ) {
    return (
      <MenuItemWrapper closeMenuOnClick={closeMenuOnClick}>
        <button ref={ref} {...props}>
          <MenuItemContent
            icon={icon}
            label={label}
            description={description}
            right={right}
            variant={variant}
          />
        </button>
      </MenuItemWrapper>
    );
  },
);

type LinkItemProps = ContentProps & LinkProps;

export const MenuLinkItem: React.FC<LinkItemProps> = ({
  icon,
  label,
  description,
  right,
  variant,
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
          variant={variant}
        />
      </Link>
    </MenuItemWrapper>
  );
};

type SubMenuTrigger = Omit<ContentProps, "right"> &
  ComponentPropsWithoutRef<"button">;

export const SubMenuTrigger = forwardRef<HTMLButtonElement, SubMenuTrigger>(
  function SubMenuTrigger(
    { icon, label, description, className, variant, ...props },
    ref,
  ) {
    return (
      <button ref={ref} {...props} className={cn(className, itemClass)}>
        <MenuItemContent
          icon={icon}
          label={label}
          description={description}
          variant={variant}
          right={<PiCaretRightBold />}
        />
      </button>
    );
  },
);
