import { XIcon } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"button">;
export const CloseButton: React.FC<Props> = (props) => {
  return (
    <button
      className="grid size-8 place-items-center rounded-md transition-colors hover:bg-white/15"
      {...props}
    >
      <XIcon size={18} />
    </button>
  );
};
