import clsx from "clsx";
import { ReactNode } from "react";

type Props = {
  color?: "primary" | "default";
  children: ReactNode;
};

export const Button: React.FC<Props> = ({ color = "default", children }) => {
  const colorClass = {
    default:
      "bg-neutral-800 border border-neutral-700 text-neutral-200 hover:bg-neutral-700",
    primary: "bg-green-700 border border-green-600 hover:bg-green-600",
  };

  return (
    <button
      className={clsx(
        "h-7 rounded-md px-2 text-xs transition-colors",
        colorClass[color],
      )}
    >
      {children}
    </button>
  );
};
