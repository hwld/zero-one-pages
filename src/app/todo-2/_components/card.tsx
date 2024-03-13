import { ReactNode } from "react";

export const Card: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
}) => {
  return (
    <div className="w-full grow gap-4 rounded-lg bg-zinc-800 p-6 shadow-2xl">
      {children}
    </div>
  );
};
