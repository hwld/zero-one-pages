import clsx from "clsx";
import { ReactNode } from "react";

export const TaskTableData: React.FC<{
  children: ReactNode;
  noWrap?: boolean;
}> = ({ children, noWrap }) => {
  return (
    <td className={clsx("px-3 py-1 text-sm", noWrap && "whitespace-nowrap")}>
      <div className="flex items-center tabular-nums" suppressHydrationWarning>
        {children}
      </div>
    </td>
  );
};
