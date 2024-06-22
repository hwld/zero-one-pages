import { ComponentPropsWithoutRef, ReactNode } from "react";

// TODO: 似たコンポーネントがあるから共通化する？

type DrawerItemProps = {
  icon?: React.FC<{ size?: number | string | undefined; className?: string }>;
  left?: ReactNode;
  title: string;
} & ComponentPropsWithoutRef<"button">;
export const DrawerItem: React.FC<DrawerItemProps> = ({
  icon: Icon,
  left,
  title,
}) => {
  return (
    <button className="flex h-8 w-full items-center justify-between gap-2 rounded-md px-2 text-neutral-100 transition-colors hover:bg-white/15">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} className="text-neutral-400" />}
        <span className="text-sm">{title}</span>
      </div>
      {left}
    </button>
  );
};
