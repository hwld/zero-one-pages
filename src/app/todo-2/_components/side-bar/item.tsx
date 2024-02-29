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
          ? "border border-gray-600 bg-gray-700 text-gray-100 shadow-2xl"
          : "text-gray-200 hover:bg-white/10",
      )}
    >
      <Icon size={25} />
      <p>{label}</p>
    </div>
  );
};
