export const TableHeader: React.FC<{
  icon?: React.FC<{ size?: number; className?: string }>;
  text: string;
  width?: number;
}> = ({ icon: Icon, text, width }) => {
  return (
    <th
      className="whitespace-nowrap border-b border-gray-600 bg-black/10 p-3 font-medium text-gray-400"
      style={{ width }}
    >
      <div className="text-m flex items-center gap-1">
        {Icon && <Icon size={18} />}
        <div>{text}</div>
      </div>
    </th>
  );
};
