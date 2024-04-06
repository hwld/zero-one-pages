import clsx from "clsx";
import { KanbanSquareIcon, LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import Link from "next/link";

type ViewTabProps = { icon?: LucideIcon; children: ReactNode };
const ViewTabContent: React.FC<ViewTabProps> = ({
  icon: Icon = KanbanSquareIcon,
  children,
}) => {
  return (
    <>
      <Icon size={20} />
      <div className="text-sm">{children}</div>
    </>
  );
};

const viewTabClass = (active: boolean = false) =>
  clsx(
    "-mb-[1px] flex items-center gap-2 border-x border-t px-4 py-2",
    active
      ? "pointer-events-none rounded-t-md border-neutral-600 bg-neutral-800 text-neutral-100"
      : "rounded-md border-transparent text-neutral-400 transition-colors hover:bg-white/10 hover:text-neutral-100",
  );

type ViewTabButtonProps = ViewTabProps & { active?: boolean };
export const ViewTabButton: React.FC<ViewTabButtonProps> = ({
  icon,
  children,
}) => {
  return (
    <button className={viewTabClass(false)}>
      <ViewTabContent icon={icon}>{children}</ViewTabContent>
    </button>
  );
};

type ViewTabLinkProps = ViewTabProps & { href: string; active?: boolean };
export const ViewTabLink: React.FC<ViewTabLinkProps> = ({
  href,
  icon,
  active = false,
  children,
}) => {
  return (
    <Link href={href} className={viewTabClass(active)}>
      <ViewTabContent icon={icon}>{children}</ViewTabContent>
    </Link>
  );
};
