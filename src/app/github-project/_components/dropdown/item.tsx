import clsx from "clsx";
import { LucideIcon } from "lucide-react";
import {
  ComponentPropsWithoutRef,
  PropsWithChildren,
  ReactNode,
  forwardRef,
} from "react";
import { useDropdown } from "./provider";
import { useListItem, useMergeRefs } from "@floating-ui/react";

type DropdownItemGroupProps = { group: string; children: ReactNode };
export const DropdownItemGroup: React.FC<DropdownItemGroupProps> = ({
  group,
  children,
}) => {
  return (
    <div className="flex flex-col">
      <div className="px-4 pb-1 pt-2 text-xs text-neutral-400">{group}</div>
      <DropdownItemList>{children}</DropdownItemList>
    </div>
  );
};

type DropdownItemListProps = { children: ReactNode };
export const DropdownItemList: React.FC<DropdownItemListProps> = ({
  children,
}) => {
  return <div className="px-2">{children}</div>;
};

type DropdownItemBaseProps = {
  red?: boolean;
} & PropsWithChildren &
  ComponentPropsWithoutRef<"button">;

export const DropdownItemBase = forwardRef<
  HTMLButtonElement,
  DropdownItemBaseProps
>(function DropdownItemBase({ red, children, ...props }, outerRef) {
  const { activeIndex } = useDropdown();
  const { ref, index } = useListItem();
  const isActive = activeIndex === index;

  const mergedRef = useMergeRefs([outerRef, ref]);

  return (
    <button
      ref={mergedRef}
      {...props}
      tabIndex={isActive ? 0 : -1}
      className={clsx(
        "h-8 w-full cursor-pointer rounded-md px-2 transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        red
          ? "text-red-500 hover:bg-red-500/15 focus-visible:bg-red-500/15"
          : "text-neutral-100 hover:bg-white/15 focus-visible:bg-white/15",
      )}
    >
      {children}
    </button>
  );
});

type DropdownItemProps = {
  icon: LucideIcon;
  title: string;
  red?: boolean;
  rightIcon?: LucideIcon;
} & ComponentPropsWithoutRef<"button">;
export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  function DropdownItem(
    { icon: Icon, title, red, rightIcon: RightIcon, ...props },
    ref,
  ) {
    return (
      <DropdownItemBase ref={ref} {...props} red={red}>
        <div className="flex size-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon
              size={16}
              className={clsx("text-neutral-400", red && "text-red-500")}
            />
            <div className="text-sm">{title}</div>
          </div>
          {RightIcon && <RightIcon size={16} className="text-neutral-400" />}
        </div>
      </DropdownItemBase>
    );
  },
);
