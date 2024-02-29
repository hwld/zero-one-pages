import clsx from "clsx";

export const INPUT_BASE_CLASS =
  "rounded bg-neutral-800 px-3 py-2 text-neutral-100 focus-visible:outline-none";

type Props = { label: string };

export const Input: React.FC<Props> = ({ label }) => {
  return (
    <div className="flex w-full flex-col gap-1">
      <label className="text-sm">{label}</label>
      <input className={clsx(INPUT_BASE_CLASS)} />
    </div>
  );
};
