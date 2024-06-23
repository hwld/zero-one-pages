import { LucideIcon } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";

type Props = {
  icon: LucideIcon;
} & Omit<ComponentPropsWithoutRef<"button">, "className">;

export const IconButton: React.FC<Props> = ({ icon: Icon, ...props }) => {
  return (
    <button
      {...props}
      className="grid size-8 place-items-center rounded-md transition-colors hover:bg-white/15"
    >
      <Icon size={18} />
    </button>
  );
};
