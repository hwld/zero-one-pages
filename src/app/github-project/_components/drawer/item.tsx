import { ComponentPropsWithoutRef } from "react";

type DrawerItemProps = {
  icon: React.FC<{ size?: number | string | undefined; className?: string }>;
  title: string;
} & ComponentPropsWithoutRef<"button">;
export const DrawerItem: React.FC<DrawerItemProps> = ({
  icon: Icon,
  title,
}) => {
  return (
    <button className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-neutral-100 transition-colors hover:bg-white/15">
      <Icon size={16} className="text-neutral-400" />
      <span className="text-sm">{title}</span>
    </button>
  );
};
