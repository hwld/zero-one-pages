import { cn } from "@/lib/utils";
import { IconType } from "react-icons/lib";
import { TbArrowsDiagonal2, TbArrowsDiagonalMinimize } from "react-icons/tb";

export const CollapseIcon: IconType = ({ className, ...props }) => {
  return (
    <TbArrowsDiagonalMinimize
      {...props}
      className={cn("rotate-45", className)}
    />
  );
};

export const ExpandIcon: IconType = ({ className, ...props }) => {
  return (
    <TbArrowsDiagonal2 {...props} className={cn("rotate-45", className)} />
  );
};
