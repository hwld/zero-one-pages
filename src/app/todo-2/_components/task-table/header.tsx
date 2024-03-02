export const TableHeader: React.FC<{
  icon?: React.FC<{ size?: number; className?: string }>;
  text: string;
  width?: number;
}> = ({ icon: Icon, text, width }) => {
  return (
    <th
      className="whitespace-nowrap border-b border-zinc-600 bg-black/10 p-3 font-medium text-zinc-400"
      style={{ width }}
    >
      <div className="text-m flex items-center gap-1">
        {Icon && <Icon size={15} />}
        <div className="mt-[1px]">{text}</div>
      </div>
    </th>
  );
};
