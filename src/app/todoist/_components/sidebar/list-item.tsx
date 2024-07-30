import clsx from "clsx";
import { ReactNode, ComponentPropsWithoutRef } from "react";
import { IconType } from "react-icons/lib";

type Props = {
  icon: IconType;
  active?: boolean;
  right?: ReactNode;
} & ComponentPropsWithoutRef<"button">;

export const SidebarListItem: React.FC<Props> = ({
  icon: Icon,
  right,
  active,
  children,
  ...props
}) => {
  const mutedTextClass = "text-stone-500";
  const activeTextClass = "text-rose-700";

  return (
    <li>
      <button
        {...props}
        className={clsx(
          "flex h-9 w-full items-center justify-between gap-2 rounded px-2 transition-colors",
          active ? clsx("bg-rose-100", activeTextClass) : "hover:bg-black/5",
        )}
      >
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
      </button>
    </li>
  );
};
