import { ReactNode } from "react";
import { taskCardItemClass } from "./task-card-button";
import Link from "next/link";

export const TaskCardLink: React.FC<{
  icon: ReactNode;
  href: string;
  onClick?: () => void;
}> = ({ icon, href, onClick }) => {
  return (
    <Link href={href} onClick={onClick} className={taskCardItemClass}>
      {icon}
    </Link>
  );
};
