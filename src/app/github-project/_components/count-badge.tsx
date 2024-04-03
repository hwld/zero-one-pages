type Props = { count: number };

export const CountBadge: React.FC<Props> = ({ count }) => {
  return (
    <div className="grid min-w-6 place-items-center rounded-full bg-white/10 p-1 text-xs text-neutral-400">
      {count}
    </div>
  );
};
