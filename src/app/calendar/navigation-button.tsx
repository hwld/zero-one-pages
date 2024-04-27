import { ComponentPropsWithoutRef } from "react";
import { IconType } from "react-icons/lib";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";

type Direction = "prev" | "next";

type Props = {
  dir: Direction;
} & Omit<ComponentPropsWithoutRef<"button">, "children">;

export const NavigationButton: React.FC<Props> = ({ dir, ...props }) => {
  const iconMap = {
    prev: TbChevronLeft,
    next: TbChevronRight,
  } satisfies Record<Direction, IconType>;
  const Icon = iconMap[dir];

  return (
    <button
      {...props}
      className="grid size-6 place-items-center rounded text-lg transition-colors hover:bg-neutral-500/20"
    >
      <Icon />
    </button>
  );
};
