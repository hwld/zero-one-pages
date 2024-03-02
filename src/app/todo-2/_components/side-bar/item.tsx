import clsx from "clsx";

export const SidebarItem: React.FC<{
  icon: React.FC<{ size?: number }>;
  label: string;
  active?: boolean;
}> = ({ icon: Icon, label, active }) => {
  return (
    <div
      className={clsx(
        "flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-md p-2 text-sm transition-colors",
        active
          ? "border border-zinc-600 bg-zinc-700 text-zinc-100 shadow-2xl"
          : "text-zinc-200 hover:bg-white/10",
      )}
    >
      <Icon size={18} />
      <p>{label}</p>
    </div>
  );
};
