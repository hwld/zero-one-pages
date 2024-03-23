import { ReactNode } from "react";

export const Card: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="rounded-lg border-2 border-neutral-300 bg-neutral-100 p-3 py-2 text-neutral-700">
      {children}
    </div>
  );
};
