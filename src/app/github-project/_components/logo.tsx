import { CatIcon } from "lucide-react";

export const Logo: React.FC = () => {
  return (
    <div className="grid size-8 shrink-0 place-items-center rounded-full bg-neutral-300 text-neutral-800">
      <CatIcon size={23} className="mt-[2px] fill-neutral-800" />
    </div>
  );
};
