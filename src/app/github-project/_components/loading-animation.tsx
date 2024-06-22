import { CatIcon } from "lucide-react";

export const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 text-neutral-400">
      <CatIcon size={50} className="animate-bounce" />
      <div className="text-sm">One moment please...</div>
    </div>
  );
};
