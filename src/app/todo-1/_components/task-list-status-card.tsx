import { ReactNode } from "react";

type Props = { children: ReactNode };
export const TaskListStatusCard: React.FC<Props> = ({ children }) => {
  return (
    <div className="grid w-full place-items-center gap-2 rounded-lg border border-neutral-300 bg-neutral-100 px-5 py-20 text-neutral-700">
      {children}
    </div>
  );
};
