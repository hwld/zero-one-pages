import clsx from "clsx";
import { ChevronRightIcon, LucideIcon } from "lucide-react";
import { ComponentPropsWithoutRef, ReactNode, forwardRef } from "react";
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

type DropdownItemProps = {
  icon: LucideIcon;
  title: string;
  red?: boolean;
  leftIcon?: LucideIcon;
} & ComponentPropsWithoutRef<"button">;
export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  function DropdownItem(
    { icon: Icon, title, red, leftIcon: LeftIcon, ...props },
    outerRef,
  ) {
    const { activeIndex } = useDropdown();
    const { ref, index } = useListItem();
    const isActive = activeIndex === index;

    const mergedRef = useMergeRefs([outerRef, ref]);

    return (
      <button
        {...props}
        ref={mergedRef}
        tabIndex={isActive ? 0 : -1}
        className={clsx(
          "flex h-8 w-full cursor-pointer items-center justify-between gap-2 rounded-md px-2 transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          red
            ? "text-red-500 hover:bg-red-500/15 focus-visible:bg-red-500/15"
            : "text-neutral-100 hover:bg-white/15 focus-visible:bg-white/15",
        )}
      >
        <div className="flex items-center gap-2">
          <Icon
            size={16}
            className={clsx("text-neutral-400", red && "text-red-500")}
          />
          <div className="text-sm">{title}</div>
        </div>
        {LeftIcon && <LeftIcon size={16} className="text-neutral-400" />}
      </button>
    );
  },
);

//TODO:
export const ViewConfigMenuItem = forwardRef<
  HTMLButtonElement,
  {
    icon: LucideIcon;
    title: string;
    value: string;
  } & ComponentPropsWithoutRef<"button">
>(function ViewConfigMenuItem(
  { icon: Icon, title, value, ...props },
  outerRef,
) {
  const { activeIndex } = useDropdown();
  const { ref, index } = useListItem();
  const isActive = activeIndex === index;

  const mergedRef = useMergeRefs([outerRef, ref]);

  return (
    <button
      {...props}
      ref={mergedRef}
      tabIndex={isActive ? 0 : -1}
      className={clsx(
        "flex h-8 w-full cursor-pointer items-center justify-between gap-4 rounded-md px-2 text-neutral-100 transition-colors hover:bg-white/15 focus-visible:bg-white/15 focus-visible:outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      )}
    >
      <div className="flex items-center gap-2 text-neutral-400">
        <Icon size={16} />
        <div className="text-sm">{title}:</div>
      </div>
      <div className="flex min-w-0 items-center gap-1">
        <div className="truncate text-nowrap text-sm">{value}</div>
        <ChevronRightIcon size={16} className="text-neutral-400" />
      </div>
    </button>
  );
});
